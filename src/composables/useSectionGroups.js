import { computed, toValue } from 'vue'
import { sectionIconPath } from '../lib/defaults'
import { state } from '../lib/store'

/**
 * Sections in display order, each with the visible fields it contains.
 * Sections with no visible fields are dropped unless `includeEmpty` is true.
 */
export function useSectionGroups(visibleFields, { includeEmpty = false } = {}) {
  return computed(() => {
    const fields = toValue(visibleFields)
    const lastIndex = state.sections.length - 1
    return state.sections
      .map((section, index) => ({
        ...section,
        iconPath: sectionIconPath(section.icon),
        isFirst: index === 0,
        isLast: index === lastIndex,
        fields: fields.filter((field) => field.section === section.id),
      }))
      .filter((group) => group.fields.length || toValue(includeEmpty))
  })
}
