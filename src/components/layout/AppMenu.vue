<script setup>
// The ⋮ menu: sections, theme, and backup actions.
import { ref, useTemplateRef } from 'vue'
import {
  mdiDotsVertical, mdiExport, mdiSort, mdiFolderPlusOutline, mdiImport, mdiRestore,
  mdiUnfoldLessHorizontal, mdiUnfoldMoreHorizontal, mdiWeatherNight, mdiWeatherSunny,
} from '@mdi/js'
import ResetDialog from './ResetDialog.vue'
import { useAppTheme } from '../../composables/useAppTheme'
import { useBackup } from '../../composables/useBackup'
import { useEditors } from '../../composables/useEditors'
import { useSectionPanels } from '../../composables/useSectionPanels'

defineProps({
  isEditPage: { type: Boolean, default: false },
})

const { openNewSectionEditor, openSectionOrder } = useEditors()
const { expandAll, collapseAll } = useSectionPanels()
const { isDark, toggleTheme } = useAppTheme()
const { exportBackup, importBackup, resetToDefaults } = useBackup()

const isResetDialogOpen = ref(false)
const fileInput = useTemplateRef('file-input')

async function onBackupFileChosen(event) {
  const [file] = event.target.files ?? []
  event.target.value = '' // so choosing the same file again still triggers a change
  if (file) await importBackup(file)
}
</script>

<template>
  <v-menu location="bottom end">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" :icon="mdiDotsVertical" title="More" />
    </template>
    <v-list density="compact">
      <v-list-item v-if="isEditPage" :prepend-icon="mdiFolderPlusOutline" title="Add section" @click="openNewSectionEditor" />
      <v-list-item :prepend-icon="mdiSort" title="Reorder sections…" @click="openSectionOrder" />
      <v-list-item :prepend-icon="mdiUnfoldMoreHorizontal" title="Expand all sections" @click="expandAll" />
      <v-list-item :prepend-icon="mdiUnfoldLessHorizontal" title="Collapse all sections" @click="collapseAll" />
      <v-list-item
        :prepend-icon="isDark ? mdiWeatherSunny : mdiWeatherNight"
        :title="isDark ? 'Light theme' : 'Dark theme'"
        @click="toggleTheme"
      />
      <v-divider />
      <v-list-item :prepend-icon="mdiExport" title="Export backup (JSON)" @click="exportBackup" />
      <v-list-item :prepend-icon="mdiImport" title="Import backup…" @click="fileInput.click()" />
      <v-list-item :prepend-icon="mdiRestore" title="Reset to defaults…" base-color="error" @click="isResetDialogOpen = true" />
    </v-list>
  </v-menu>

  <ResetDialog v-model="isResetDialogOpen" @confirm="resetToDefaults" />
  <input ref="file-input" type="file" accept="application/json,.json" hidden @change="onBackupFileChosen" />
</template>
