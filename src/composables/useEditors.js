import { reactive } from 'vue'
import { createField } from '../lib/defaults'
import { state } from '../lib/store'

// The field, section and section-order dialogs are mounted once (EditorDialogs.vue) and opened from anywhere.
const fieldEditor = reactive({ isOpen: false, field: null, isNew: false })
const sectionEditor = reactive({ isOpen: false, section: null }) // section null = adding
const sectionOrder = reactive({ isOpen: false })

export function useEditors() {
  function openFieldEditor(field) {
    Object.assign(fieldEditor, { isOpen: true, field, isNew: false })
  }

  function openNewFieldEditor(sectionId = state.sections[0]?.id) {
    Object.assign(fieldEditor, { isOpen: true, field: createField({ section: sectionId }), isNew: true })
  }

  function openSectionEditor(sectionId) {
    const section = state.sections.find((saved) => saved.id === sectionId) ?? null
    Object.assign(sectionEditor, { isOpen: true, section })
  }

  function openNewSectionEditor() {
    Object.assign(sectionEditor, { isOpen: true, section: null })
  }

  function openSectionOrder() {
    sectionOrder.isOpen = true
  }

  return {
    fieldEditor,
    sectionEditor,
    sectionOrder,
    openSectionOrder,
    openFieldEditor,
    openNewFieldEditor,
    openSectionEditor,
    openNewSectionEditor,
  }
}
