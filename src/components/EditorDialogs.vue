<script setup>
// Mounts the field, section and section-order dialogs once and saves their results to the store.
// Open them from anywhere with useEditors().
import FieldEditor from './fields/FieldEditor.vue'
import SectionEditor from './sections/SectionEditor.vue'
import SectionOrderDialog from './sections/SectionOrderDialog.vue'
import { addSection, deleteField, deleteSection, saveField, updateSection } from '../lib/store'
import { useEditors } from '../composables/useEditors'
import { useSectionPanels } from '../composables/useSectionPanels'
import { notify } from '../composables/useNotifier'

const { fieldEditor, sectionEditor, sectionOrder } = useEditors()
const { expandSection } = useSectionPanels()

function onFieldSave(field) {
  saveField(field)
  // Make sure the saved field is visible.
  expandSection(field.section)
}

function onSectionSave(details) {
  if (sectionEditor.section) {
    updateSection(sectionEditor.section.id, details)
  } else {
    const section = addSection(details)
    notify(`Added section “${section.title}”`)
  }
}

function onSectionDelete({ moveFieldsTo }) {
  const { id, title } = sectionEditor.section
  deleteSection(id, { moveFieldsTo })
  notify(`Deleted section “${title}”`)
}
</script>

<template>
  <FieldEditor
    v-model="fieldEditor.isOpen"
    :field="fieldEditor.field"
    :is-new="fieldEditor.isNew"
    @save="onFieldSave"
    @delete="deleteField"
  />
  <SectionEditor
    v-model="sectionEditor.isOpen"
    :section="sectionEditor.section"
    @save="onSectionSave"
    @delete="onSectionDelete"
  />
  <SectionOrderDialog v-model="sectionOrder.isOpen" />
</template>
