<script setup>
// Edit page: every field, including empty ones, plus section management.
import { computed } from 'vue'
import { mdiFolderPlusOutline, mdiSort } from '@mdi/js'
import JobDetailDefaultsPanel from '../components/job-details/JobDetailDefaultsPanel.vue'
import SectionList from '../components/sections/SectionList.vue'
import SectionActions from '../components/sections/SectionActions.vue'
import NoSearchResults from '../components/common/NoSearchResults.vue'
import { moveSection, state } from '../lib/store'
import { fieldMatchesQuery, useFieldCounts } from '../composables/useFields'
import { useSectionGroups } from '../composables/useSectionGroups'
import { useEditors } from '../composables/useEditors'

const props = defineProps({
  searchQuery: { type: String, default: '' }, // trimmed and lower-case
})

const { filledCount, totalCount } = useFieldCounts()
const { openFieldEditor, openNewFieldEditor, openSectionEditor, openNewSectionEditor, openSectionOrder } = useEditors()

const isSearching = computed(() => props.searchQuery.length > 0)
const visibleFields = computed(() => state.fields.filter((field) => fieldMatchesQuery(field, props.searchQuery)))
// Empty sections are shown so they can be filled, except while searching.
const sectionGroups = useSectionGroups(visibleFields, { includeEmpty: () => !isSearching.value })
</script>

<template>
  <div class="pa-2 d-flex flex-column ga-2">
    <div class="text-caption text-medium-emphasis px-1">
      {{ filledCount }} of {{ totalCount }} fields filled in. Only filled-in fields appear on the Use page.
    </div>
    <JobDetailDefaultsPanel />
  </div>

  <SectionList :groups="sectionGroups" editable :force-expanded="isSearching" @edit-field="openFieldEditor">
    <template #footer="{ group }">
      <SectionActions
        :group="group"
        @add-field="openNewFieldEditor(group.id)"
        @move="(offset) => moveSection(group.id, offset)"
        @edit="openSectionEditor(group.id)"
      />
    </template>
  </SectionList>

  <div v-if="!isSearching" class="pa-2 d-flex ga-2">
    <v-btn class="flex-grow-1" variant="tonal" color="primary" :prepend-icon="mdiFolderPlusOutline" @click="openNewSectionEditor">
      Add section
    </v-btn>
    <v-btn variant="tonal" color="primary" :prepend-icon="mdiSort" @click="openSectionOrder">Reorder</v-btn>
  </div>
  <NoSearchResults v-else-if="!sectionGroups.length" :query="searchQuery" />
</template>
