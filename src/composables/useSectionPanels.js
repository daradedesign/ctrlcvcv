import { ref } from 'vue'
import { state } from '../lib/store'

// Collapsed (not open) sections are tracked, so new sections start expanded.
// Shared by both pages and the menu's Expand/Collapse all.
const collapsedSectionIds = ref([])

export function useSectionPanels() {
  const isCollapsed = (sectionId) => collapsedSectionIds.value.includes(sectionId)

  const expandAll = () => { collapsedSectionIds.value = [] }
  const collapseAll = () => { collapsedSectionIds.value = state.sections.map((section) => section.id) }
  const expandSection = (sectionId) => {
    collapsedSectionIds.value = collapsedSectionIds.value.filter((id) => id !== sectionId)
  }

  /** Records which of the shown sections are open; hidden sections keep their state. */
  function setOpenSections(shownIds, openIds) {
    const hiddenCollapsed = collapsedSectionIds.value.filter((id) => !shownIds.includes(id))
    const shownCollapsed = shownIds.filter((id) => !openIds.includes(id))
    collapsedSectionIds.value = [...hiddenCollapsed, ...shownCollapsed]
  }

  return { isCollapsed, expandAll, collapseAll, expandSection, setOpenSections }
}
