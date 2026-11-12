<script setup>
// App shell: header, search, the active page, and the app-wide dialogs and snackbar.
import { computed, ref } from 'vue'
import { mdiMagnify } from '@mdi/js'
import AppHeader from './components/layout/AppHeader.vue'
import AppNotification from './components/layout/AppNotification.vue'
import UseViewToggle from './components/layout/UseViewToggle.vue'
import EditorDialogs from './components/EditorDialogs.vue'
import UsePage from './pages/UsePage.vue'
import EditPage from './pages/EditPage.vue'
import { useAppTheme } from './composables/useAppTheme'
import { useFieldCounts } from './composables/useFields'

const { syncThemeWithState } = useAppTheme()
syncThemeWithState()

const { enteredCount } = useFieldCounts()
// Open on Use once something has been filled in; until then, Edit is the useful page.
const activePage = ref(enteredCount.value > 0 ? 'use' : 'edit')

const searchText = ref('')
const searchQuery = computed(() => (searchText.value ?? '').trim().toLowerCase())
const showSearch = computed(() => activePage.value === 'edit' || enteredCount.value > 0)
</script>

<template>
  <v-app>
    <AppHeader v-model:page="activePage" />

    <v-main>
      <div v-if="showSearch" class="px-2 pt-2 d-flex align-center ga-2">
        <v-text-field
          v-model="searchText"
          :prepend-inner-icon="mdiMagnify"
          placeholder="Search fields"
          clearable
          hide-details
          density="compact"
        />
        <UseViewToggle v-if="activePage === 'use'" />
      </div>

      <UsePage v-if="activePage === 'use'" :search-query="searchQuery" @go-to-edit="activePage = 'edit'" />
      <EditPage v-else :search-query="searchQuery" />
    </v-main>

    <EditorDialogs />
    <AppNotification />
  </v-app>
</template>
