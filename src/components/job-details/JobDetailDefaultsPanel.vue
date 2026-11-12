<script setup>
// Edit page: the generic wording used when a job detail is left blank.
import { mdiBriefcaseOutline, mdiRestore } from '@mdi/js'
import CollapsiblePanel from '../common/CollapsiblePanel.vue'
import { JOB_DETAIL_FIELDS, placeholderToken } from '../../lib/formats'
import { GENERIC_JOB_DETAILS } from '../../lib/defaults'
import { state } from '../../lib/store'

function restoreGenericDefaults() {
  state.jobDetailDefaults = { ...GENERIC_JOB_DETAILS }
}
</script>

<template>
  <CollapsiblePanel :icon="mdiBriefcaseOutline" title="Job detail defaults" summary="generic fallbacks">
    <div class="text-caption text-medium-emphasis">
      Used in place of <code v-text="placeholderToken('company')" />, <code v-text="placeholderToken('position')" /> and
      <code v-text="placeholderToken('hiringManager')" /> when that job detail is left blank on the Use page,
      so cover letters still read naturally.
    </div>
    <v-text-field
      v-for="detail in JOB_DETAIL_FIELDS"
      :key="detail.key"
      v-model="state.jobDetailDefaults[detail.key]"
      :label="`Default ${detail.label.toLowerCase()}`"
      :placeholder="GENERIC_JOB_DETAILS[detail.key]"
    />
    <v-btn size="small" class="align-self-start" :prepend-icon="mdiRestore" @click="restoreGenericDefaults">
      Restore suggested defaults
    </v-btn>
  </CollapsiblePanel>
</template>
