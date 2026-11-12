import { computed, toValue } from 'vue'
import { fieldFormats } from '../lib/formats'
import { state } from '../lib/store'

/** A field's copyable formats, with job details filled in. */
export const formatsFor = (field) => fieldFormats(field, state.jobDetails, state.jobDetailDefaults)

export const hasValue = (field) => formatsFor(field).length > 0

/** True when the label or any copyable value contains the (lower-case) query. */
export function fieldMatchesQuery(field, query) {
  if (!query) return true
  return field.label.toLowerCase().includes(query)
    || formatsFor(field).some((format) => format.value.toLowerCase().includes(query))
}

/** Formats for one field, plus the one used for the main copy button. */
export function useFieldFormats(field) {
  const formats = computed(() => {
    const current = toValue(field)
    return current ? formatsFor(current) : []
  })
  const primaryFormat = computed(() =>
    formats.value.find((format) => format.label === toValue(field)?.preferredFormat) ?? formats.value[0])
  return { formats, primaryFormat }
}

export function useFieldCounts() {
  const totalCount = computed(() => state.fields.length)
  const filledCount = computed(() => state.fields.filter(hasValue).length)
  // Fields the user actually filled in; an always-today date doesn't count.
  const enteredCount = computed(() => state.fields.filter((field) => hasValue(field) && !field.value?.today).length)
  return { totalCount, filledCount, enteredCount }
}
