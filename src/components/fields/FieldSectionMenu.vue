<script setup>
// Edit page: a button that moves a field to another section.
import { computed } from 'vue'
import { mdiFolderMoveOutline } from '@mdi/js'
import { sectionIconPath } from '../../lib/defaults'
import { moveFieldToSection, state } from '../../lib/store'
import { useSectionPanels } from '../../composables/useSectionPanels'
import { notify } from '../../composables/useNotifier'

const props = defineProps({
  field: { type: Object, required: true },
})

const { expandSection } = useSectionPanels()
const otherSections = computed(() => state.sections.filter((section) => section.id !== props.field.section))

function moveTo(section) {
  moveFieldToSection(props.field.id, section.id)
  expandSection(section.id)
  notify(`Moved “${props.field.label}” to ${section.title}`)
}
</script>

<template>
  <v-menu v-if="otherSections.length" location="bottom end">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" :icon="mdiFolderMoveOutline" size="small" title="Move to another section" />
    </template>
    <v-list density="compact">
      <v-list-subheader>Move to section</v-list-subheader>
      <v-list-item
        v-for="section in otherSections"
        :key="section.id"
        :prepend-icon="sectionIconPath(section.icon)"
        :title="section.title"
        @click="moveTo(section)"
      />
    </v-list>
  </v-menu>
</template>
