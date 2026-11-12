<script setup>
// Edit page: the row of buttons at the bottom of each section.
import { mdiArrowDown, mdiArrowUp, mdiPencilOutline, mdiPlus } from '@mdi/js'

defineProps({
  group: { type: Object, required: true }, // from useSectionGroups
})
const emit = defineEmits(['add-field', 'move', 'edit'])
</script>

<template>
  <div class="section-actions d-flex align-center px-1 py-1">
    <v-btn size="small" :prepend-icon="mdiPlus" @click="emit('add-field')">Add field</v-btn>
    <v-spacer />
    <v-btn :icon="mdiArrowUp" size="small" title="Move section up" :disabled="group.isFirst" @click="emit('move', -1)" />
    <v-btn :icon="mdiArrowDown" size="small" title="Move section down" :disabled="group.isLast" @click="emit('move', 1)" />
    <v-btn
      :prepend-icon="mdiPencilOutline"
      size="small"
      title="Rename, change icon or delete this section"
      @click="emit('edit')"
    >Section</v-btn>
  </div>
</template>

<style scoped>
.section-actions { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
</style>
