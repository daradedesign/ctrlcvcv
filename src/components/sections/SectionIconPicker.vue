<script setup>
import { SECTION_ICONS } from '../../lib/defaults'

const selectedIcon = defineModel({ type: String, required: true })
</script>

<template>
  <div>
    <div class="text-caption text-medium-emphasis mb-1">Icon</div>
    <div class="icon-grid" role="group" aria-label="Section icon">
      <v-btn
        v-for="(iconPath, iconName) in SECTION_ICONS"
        :key="iconName"
        :icon="iconPath"
        size="small"
        :variant="selectedIcon === iconName ? 'flat' : 'text'"
        :color="selectedIcon === iconName ? 'primary' : undefined"
        :title="iconName"
        :aria-pressed="selectedIcon === iconName"
        @click="selectedIcon = iconName"
      />
    </div>
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 4px;
}
</style>
