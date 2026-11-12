<script setup>
// A compact list of every section. Drag a row by its handle, or use the arrows, to reorder.
// Changes apply immediately.
import { ref } from 'vue'
import { mdiArrowDown, mdiArrowUp, mdiDragVertical } from '@mdi/js'
import { sectionIconPath } from '../../lib/defaults'
import { fieldsInSection, moveSection, moveSectionTo, state } from '../../lib/store'

const isOpen = defineModel({ type: Boolean, default: false })

const draggedSectionId = ref(null)

function fieldCountLabel(sectionId) {
  const count = fieldsInSection(sectionId).length
  return `${count} field${count === 1 ? '' : 's'}`
}

function onDragStart(event, section) {
  draggedSectionId.value = section.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', section.title) // Firefox needs data to start a drag
}

// The dragged row moves as soon as it passes over another row, so the list shows the result live.
function onDragEnter(targetIndex) {
  if (draggedSectionId.value) moveSectionTo(draggedSectionId.value, targetIndex)
}

function onDragEnd() {
  draggedSectionId.value = null
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="420" scrollable>
    <v-card title="Reorder sections" subtitle="Drag a section, or use the arrows">
      <v-card-text class="px-2">
        <v-list density="compact" class="py-0">
          <v-list-item
            v-for="(section, index) in state.sections"
            :key="section.id"
            class="section-row"
            :class="{ 'is-dragging': section.id === draggedSectionId }"
            draggable="true"
            @dragstart="onDragStart($event, section)"
            @dragenter.prevent="onDragEnter(index)"
            @dragover.prevent
            @drop.prevent
            @dragend="onDragEnd"
          >
            <template #prepend>
              <v-icon :icon="mdiDragVertical" class="drag-handle mr-1" />
              <v-icon :icon="sectionIconPath(section.icon)" color="primary" size="small" />
            </template>
            <v-list-item-title class="text-body-2">{{ section.title }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{ fieldCountLabel(section.id) }}</v-list-item-subtitle>
            <template #append>
              <v-btn
                :icon="mdiArrowUp"
                size="x-small"
                :title="`Move ${section.title} up`"
                :disabled="index === 0"
                @click="moveSection(section.id, -1)"
              />
              <v-btn
                :icon="mdiArrowDown"
                size="x-small"
                :title="`Move ${section.title} down`"
                :disabled="index === state.sections.length - 1"
                @click="moveSection(section.id, 1)"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="isOpen = false">Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.section-row {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: grab;
}
.section-row.is-dragging { opacity: 0.4; }
.drag-handle { opacity: 0.6; }
</style>
