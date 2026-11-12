<script setup>
// A single bordered, collapsible panel with an icon, a title and a short summary.
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, default: '' },
})
</script>

<template>
  <v-expansion-panels variant="accordion" class="collapsible-panel">
    <v-expansion-panel elevation="0">
      <v-expansion-panel-title class="py-2">
        <v-icon :icon="icon" size="small" class="mr-2" />
        <span class="text-body-2 font-weight-medium">{{ title }}</span>
        <span v-if="summary" class="text-caption text-medium-emphasis ml-2 text-truncate">{{ summary }}</span>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="d-flex flex-column ga-2">
          <slot />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.collapsible-panel {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
}
</style>
