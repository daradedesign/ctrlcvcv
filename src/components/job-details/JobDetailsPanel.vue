<script setup>
// Use page: the company, position and hiring manager for the current application.
import { computed } from 'vue'
import { mdiBriefcaseOutline } from '@mdi/js'
import CollapsiblePanel from '../common/CollapsiblePanel.vue'
import { JOB_DETAIL_FIELDS } from '../../lib/formats'
import { blankJobDetails } from '../../lib/defaults'
import { state } from '../../lib/store'

const hasAnyDetail = computed(() => JOB_DETAIL_FIELDS.some(({ key }) => state.jobDetails[key]))

const summary = computed(() => {
  if (!hasAnyDetail.value) return 'using generic details'
  const { position, company } = state.jobDetails
  return [position, company].filter(Boolean).join(' @ ')
})

function clearJobDetails() {
  state.jobDetails = blankJobDetails()
}
</script>

<template>
  <CollapsiblePanel :icon="mdiBriefcaseOutline" title="Job details" :summary="summary">
    <v-text-field
      v-for="detail in JOB_DETAIL_FIELDS"
      :key="detail.key"
      v-model="state.jobDetails[detail.key]"
      :label="detail.label"
      :placeholder="state.jobDetailDefaults[detail.key]"
      persistent-placeholder
      clearable
    />
    <div class="d-flex align-center ga-2">
      <div class="text-caption text-medium-emphasis flex-grow-1">
        Blank details use the generic defaults shown in grey (change them on the Edit page).
      </div>
      <v-btn v-if="hasAnyDetail" size="small" @click="clearJobDetails">Clear</v-btn>
    </div>
  </CollapsiblePanel>
</template>
