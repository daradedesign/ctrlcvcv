<script setup>
// Sections as collapsible panels, each listing its fields.
// The `footer` slot adds content under each section's fields (the Edit page's section actions).
import { computed } from 'vue'
import FieldItem from '../fields/FieldItem.vue'
import FieldButton from '../fields/FieldButton.vue'
import { useSectionPanels } from '../../composables/useSectionPanels'

const props = defineProps({
  groups: { type: Array, required: true }, // from useSectionGroups
  editable: { type: Boolean, default: false },
  // 'rows' shows each value; 'buttons' shows a compact copy button per field (Use page only).
  layout: { type: String, default: 'rows' },
  // Open every section regardless of what the user collapsed (used while searching).
  forceExpanded: { type: Boolean, default: false },
})
const emit = defineEmits(['edit-field'])

const { isCollapsed, setOpenSections } = useSectionPanels()

const openSectionIds = computed({
  get: () => props.groups
    .map((group) => group.id)
    .filter((id) => props.forceExpanded || !isCollapsed(id)),
  set: (openIds) => {
    if (!props.forceExpanded) setOpenSections(props.groups.map((group) => group.id), openIds)
  },
})
</script>

<template>
  <v-expansion-panels v-model="openSectionIds" multiple variant="accordion" class="section-list">
    <v-expansion-panel v-for="group in groups" :key="group.id" :value="group.id" elevation="0">
      <v-expansion-panel-title class="py-2">
        <v-icon :icon="group.iconPath" size="small" class="mr-2" color="primary" />
        <span class="text-body-2 font-weight-medium text-truncate">{{ group.title }}</span>
        <v-chip size="x-small" class="ml-2 flex-shrink-0" variant="tonal">{{ group.fields.length }}</v-chip>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <div v-if="layout === 'buttons'" class="field-buttons pa-3">
          <FieldButton v-for="field in group.fields" :key="field.id" :field="field" />
        </div>
        <template v-for="(field, index) in group.fields" v-else :key="field.id">
          <v-divider v-if="index > 0" />
          <FieldItem :field="field" :editable="editable" @edit="emit('edit-field', field)" />
        </template>
        <div v-if="editable && !group.fields.length" class="text-body-2 text-medium-emphasis px-3 pt-2">
          No fields in this section yet.
        </div>
        <slot name="footer" :group="group" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.section-list :deep(.v-expansion-panel-text__wrapper) { padding: 0 !important; }
.field-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
