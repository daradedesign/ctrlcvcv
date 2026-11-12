// App state, saved to chrome.storage.local. Outside the extension (e.g. `npm run dev`)
// it falls back to localStorage.
import { reactive, watch } from 'vue'
import { DEFAULT_SECTION_ICON, createId, defaultState } from './defaults'

const STORAGE_KEY = 'ctrlcvcv:v1'
const SAVE_DELAY_MS = 250
const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage?.local

async function readSavedData() {
  if (hasChromeStorage) return (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY]
  const json = localStorage.getItem(STORAGE_KEY)
  return json ? JSON.parse(json) : undefined
}

async function writeSavedData(data) {
  if (hasChromeStorage) return chrome.storage.local.set({ [STORAGE_KEY]: data })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const state = reactive(defaultState())

/** A plain (non-reactive) copy of the state, for saving and exporting. */
export const stateSnapshot = () => JSON.parse(JSON.stringify(state))

// JSON of the data as last saved or loaded. Used to skip saves that change nothing and to
// ignore storage-change events caused by this panel's own saves.
let lastSavedJSON = ''
let saveTimer

function scheduleSave() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const snapshot = stateSnapshot()
    const json = JSON.stringify(snapshot)
    if (json === lastSavedJSON) return
    lastSavedJSON = json
    writeSavedData(snapshot)
  }, SAVE_DELAY_MS)
}

/**
 * Each Chrome window has its own side panel, each with its own copy of the state.
 * When another panel saves, load its data so this panel shows the same sections and
 * fields, and doesn't overwrite them with stale data on its next save.
 */
function onExternalChange(data) {
  const json = JSON.stringify(data)
  if (!data?.fields || json === lastSavedJSON) return
  clearTimeout(saveTimer)
  replaceState(data)
  // Compare future saves against the loaded state, so loading it doesn't trigger a save.
  lastSavedJSON = JSON.stringify(stateSnapshot())
}

function listenForExternalChanges() {
  if (hasChromeStorage) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[STORAGE_KEY]) onExternalChange(changes[STORAGE_KEY].newValue)
    })
  } else {
    // localStorage fires `storage` only in other tabs, never the one that saved.
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY && event.newValue) onExternalChange(JSON.parse(event.newValue))
    })
  }
}

export async function initStore() {
  try {
    const saved = await readSavedData()
    if (saved?.fields) replaceState(saved)
  } catch (error) {
    console.error('Failed to load saved data', error)
  }
  lastSavedJSON = JSON.stringify(stateSnapshot())
  watch(state, scheduleSave, { deep: true })
  listenForExternalChanges()
}

/** Loads saved or imported data, filling in anything older versions didn't have. */
export function replaceState(data) {
  const defaults = defaultState()
  // Version 1 called job details `vars` and their defaults `varDefaults`.
  const { vars, varDefaults, ...saved } = data
  Object.assign(state, defaults, saved, {
    version: defaults.version,
    jobDetails: { ...defaults.jobDetails, ...(saved.jobDetails ?? vars) },
    jobDetailDefaults: { ...defaults.jobDetailDefaults, ...(saved.jobDetailDefaults ?? varDefaults) },
    // Saves from before custom sections get the default list.
    sections: saved.sections?.length ? saved.sections : defaults.sections,
  })
  moveOrphanedFields()
}

export function resetState() {
  Object.assign(state, defaultState())
}

// ---------- Fields ----------

export const fieldsInSection = (sectionId) => state.fields.filter((field) => field.section === sectionId)

/** Adds the field, or replaces the saved field with the same id. */
export function saveField(field) {
  const index = state.fields.findIndex((saved) => saved.id === field.id)
  if (index === -1) state.fields.push(field)
  else state.fields.splice(index, 1, field)
}

export function deleteField(fieldId) {
  state.fields = state.fields.filter((field) => field.id !== fieldId)
}

export function moveFieldToSection(fieldId, sectionId) {
  const field = state.fields.find((saved) => saved.id === fieldId)
  if (field && state.sections.some((section) => section.id === sectionId)) field.section = sectionId
}

/** Makes a format the field's default, or clears it if it already is. */
export function togglePreferredFormat(fieldId, formatLabel) {
  const field = state.fields.find((saved) => saved.id === fieldId)
  if (field) field.preferredFormat = field.preferredFormat === formatLabel ? undefined : formatLabel
}

// ---------- Sections ----------

/** Any field whose section no longer exists moves to the first section. */
function moveOrphanedFields() {
  const sectionIds = new Set(state.sections.map((section) => section.id))
  for (const field of state.fields) {
    if (!sectionIds.has(field.section)) field.section = state.sections[0].id
  }
}

export function addSection({ title, icon }) {
  const section = {
    id: createId('s'),
    title: title.trim() || 'Untitled section',
    icon: icon || DEFAULT_SECTION_ICON,
  }
  state.sections.push(section)
  return section
}

export function updateSection(sectionId, { title, icon }) {
  const section = state.sections.find((saved) => saved.id === sectionId)
  if (!section) return
  section.title = title.trim() || section.title
  section.icon = icon || section.icon
}

/** Moves a section to a position in the list (0 = first). */
export function moveSectionTo(sectionId, toIndex) {
  const from = state.sections.findIndex((section) => section.id === sectionId)
  if (from < 0 || from === toIndex || toIndex < 0 || toIndex >= state.sections.length) return
  const [section] = state.sections.splice(from, 1)
  state.sections.splice(toIndex, 0, section)
}

/** offset: -1 moves the section up, 1 moves it down. */
export function moveSection(sectionId, offset) {
  const from = state.sections.findIndex((section) => section.id === sectionId)
  if (from >= 0) moveSectionTo(sectionId, from + offset)
}

/** Deletes a section. Its fields move to `moveFieldsTo`, or are deleted when that is null. */
export function deleteSection(sectionId, { moveFieldsTo = null } = {}) {
  if (state.sections.length <= 1) return
  if (moveFieldsTo) {
    for (const field of fieldsInSection(sectionId)) field.section = moveFieldsTo
  } else {
    state.fields = state.fields.filter((field) => field.section !== sectionId)
  }
  state.sections = state.sections.filter((section) => section.id !== sectionId)
  moveOrphanedFields()
}
