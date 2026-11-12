<script setup>
// Word and character counts, plus chips for {{placeholders}} whose job detail is blank.
import { computed } from 'vue'
import { mdiAlertOutline, mdiInformationOutline } from '@mdi/js'
import { placeholdersIn } from '../../lib/formats'
import { state } from '../../lib/store'

const props = defineProps({
  templateText: { type: String, default: '' }, // the saved text, with {{placeholders}}
  copyText: { type: String, default: '' }, // the text as copied, placeholders filled in
  showCounts: { type: Boolean, default: false },
})

const blankDetailKeys = computed(() =>
  placeholdersIn(props.templateText).filter((key) => key !== 'date' && !state.jobDetails[key]?.trim()))
// Blank details with a generic default fill in with that default...
const genericKeys = computed(() => blankDetailKeys.value.filter((key) => state.jobDetailDefaults[key]?.trim()))
// ...the rest have no default, so stay as {{key}}.
const missingKeys = computed(() => blankDetailKeys.value.filter((key) => !state.jobDetailDefaults[key]?.trim()))

const counts = computed(() => {
  const text = props.copyText.trim()
  const words = text ? text.split(/\s+/).length : 0
  return `${words} words · ${props.copyText.length} chars`
})
</script>

<template>
  <div v-if="showCounts || blankDetailKeys.length" class="d-flex align-center flex-wrap ga-1 mt-1">
    <span v-if="showCounts" class="text-caption text-medium-emphasis">{{ counts }}</span>
    <v-chip
      v-for="key in genericKeys"
      :key="key"
      size="x-small"
      color="info"
      variant="tonal"
      :prepend-icon="mdiInformationOutline"
      :title="`No ${key} entered under Job details, so the generic “${state.jobDetailDefaults[key]}” is used`"
    >generic {{ key }}</v-chip>
    <v-chip
      v-for="key in missingKeys"
      :key="key"
      size="x-small"
      color="warning"
      variant="tonal"
      :prepend-icon="mdiAlertOutline"
      :title="`Fill in “${key}” under Job details, or set a default on the Edit page, to replace {{${key}}}`"
    >{{ key }}</v-chip>
  </div>
</template>
