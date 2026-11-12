<script setup>
// App bar: logo, add-field button, menu, and the Use / Edit tabs.
import { computed } from 'vue'
import { mdiContentCopy, mdiPencilOutline, mdiPlus } from '@mdi/js'
import AppLogo from './AppLogo.vue'
import AppMenu from './AppMenu.vue'
import { useEditors } from '../../composables/useEditors'

const page = defineModel('page', { type: String, required: true }) // 'use' | 'edit'
const isEditPage = computed(() => page.value === 'edit')
const { openNewFieldEditor } = useEditors()
</script>

<template>
  <v-app-bar density="compact" color="primary" flat>
    <v-app-bar-title><AppLogo variant="light" height="32" /></v-app-bar-title>
    <v-btn v-if="isEditPage" :icon="mdiPlus" title="Add field" @click="openNewFieldEditor()" />
    <AppMenu :is-edit-page="isEditPage" />

    <template #extension>
      <v-tabs v-model="page" grow density="compact" class="w-100" color="white" slider-color="white">
        <v-tab value="use" :prepend-icon="mdiContentCopy">Use</v-tab>
        <v-tab value="edit" :prepend-icon="mdiPencilOutline">Edit</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>
