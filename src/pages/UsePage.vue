<script setup>
// Use page: only fields that have a value. Clicking a value copies it.
import { computed } from 'vue'
import { mdiPencilOutline } from '@mdi/js'
import JobDetailsPanel from '../components/job-details/JobDetailsPanel.vue'
import SectionList from '../components/sections/SectionList.vue'
import NoSearchResults from '../components/common/NoSearchResults.vue'
import { state } from '../lib/store'
import { fieldMatchesQuery, hasValue, useFieldCounts } from '../composables/useFields'
import { useSectionGroups } from '../composables/useSectionGroups'

const props = defineProps({
  searchQuery: { type: String, default: '' }, // trimmed and lower-case
})
const emit = defineEmits(['go-to-edit'])

const { enteredCount } = useFieldCounts()
const visibleFields = computed(() =>
  state.fields.filter((field) => hasValue(field) && fieldMatchesQuery(field, props.searchQuery)))
const sectionGroups = useSectionGroups(visibleFields)
</script>

<template>
  <div v-if="!enteredCount" class="text-center pa-6">
    <v-icon :icon="mdiPencilOutline" size="40" class="text-medium-emphasis mb-2" />
    <div class="text-body-1 mb-1">Nothing filled in yet</div>
    <div class="text-body-2 text-medium-emphasis mb-4">
      Add your links, phone number, salary, dates and cover letters on the Edit page.
      Only fields with a value show up here.
    </div>
    <v-btn color="primary" variant="flat" @click="emit('go-to-edit')">Go to Edit</v-btn>
  </div>

  <template v-else>
    <div class="pa-2">
      <JobDetailsPanel />
    </div>
    <SectionList
      :groups="sectionGroups"
      :layout="state.useView === 'buttons' ? 'buttons' : 'rows'"
      :force-expanded="!!searchQuery"
    />
    <NoSearchResults v-if="searchQuery && !sectionGroups.length" :query="searchQuery" />
  </template>
</template>
