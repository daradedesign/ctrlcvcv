<script setup>
// One field row. Use page: clicking the row copies the value. Edit page: clicking opens the editor.
import { computed, ref } from 'vue'
import { mdiContentCopy, mdiPencilOutline, mdiChevronDown, mdiChevronUp, mdiOpenInNew } from '@mdi/js'
import FieldFormatList from './FieldFormatList.vue'
import FieldTextInfo from './FieldTextInfo.vue'
import FieldSectionMenu from './FieldSectionMenu.vue'
import { isMultiFormat } from '../../lib/defaults'
import { useFieldFormats } from '../../composables/useFields'
import { copyToClipboard } from '../../composables/useClipboard'

const props = defineProps({
  field: { type: Object, required: true },
  editable: { type: Boolean, default: false },
})
const emit = defineEmits(['edit'])

const { formats, primaryFormat } = useFieldFormats(() => props.field)
const isExpanded = ref(false)

const isMultiFormatField = computed(() => isMultiFormat(props.field.type))
const isLongText = computed(() => props.field.type === 'long')
const isExpandable = computed(() => !!primaryFormat.value && (isMultiFormatField.value || isLongText.value))
const linkUrl = computed(() => {
  const url = primaryFormat.value?.value ?? ''
  return props.field.type === 'url' && /^https?:\/\//i.test(url) ? url : null
})
const rowTitle = computed(() => {
  if (!props.editable) return 'Click to copy'
  return primaryFormat.value ? 'Click to edit' : 'Click to add a value'
})

function copyPrimaryFormat() {
  if (!primaryFormat.value) return
  // Long text is summarised by its label rather than a preview of the text.
  copyToClipboard(primaryFormat.value.value, isLongText.value ? props.field.label : '')
}

function onRowClick() {
  if (props.editable || !primaryFormat.value) emit('edit', props.field)
  else copyPrimaryFormat()
}
</script>

<template>
  <div class="px-3 py-2">
    <div class="d-flex align-center ga-1">
      <div class="flex-grow-1 min-w-0 clickable" :title="rowTitle" @click="onRowClick">
        <div class="text-caption text-medium-emphasis text-truncate">
          {{ field.label }}
          <span v-if="isMultiFormatField && primaryFormat" class="format-label">· {{ primaryFormat.label }}</span>
        </div>
        <div v-if="!primaryFormat" class="text-body-2 text-disabled font-italic">Not set — click to add</div>
        <div v-else-if="isLongText" class="text-body-2 long-text-preview">{{ primaryFormat.value }}</div>
        <div v-else class="text-body-2 text-truncate monospace">{{ primaryFormat.value }}</div>
      </div>

      <v-btn v-if="primaryFormat" :icon="mdiContentCopy" size="small" color="primary" title="Copy" @click="copyPrimaryFormat" />
      <v-btn v-if="linkUrl" :icon="mdiOpenInNew" size="small" title="Open link" :href="linkUrl" target="_blank" />
      <v-btn
        v-if="isExpandable"
        :icon="isExpanded ? mdiChevronUp : mdiChevronDown"
        size="small"
        :title="isMultiFormatField ? 'All formats' : 'Show full text'"
        @click="isExpanded = !isExpanded"
      />
      <template v-if="editable">
        <FieldSectionMenu :field="field" />
        <v-btn :icon="mdiPencilOutline" size="small" title="Edit" @click="emit('edit', field)" />
      </template>
    </div>

    <FieldTextInfo
      v-if="primaryFormat"
      :template-text="field.value?.text"
      :copy-text="primaryFormat.value"
      :show-counts="isLongText"
    />

    <v-expand-transition>
      <div v-if="isExpanded && primaryFormat">
        <div v-if="isLongText" class="full-text text-body-2 mt-2 pa-2 rounded">{{ primaryFormat.value }}</div>
        <FieldFormatList v-else :field="field" :formats="formats" />
      </div>
    </v-expand-transition>
  </div>
</template>

<style scoped>
.min-w-0 { min-width: 0; }
.clickable { cursor: pointer; }
.monospace { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.8125rem !important; }
.format-label { opacity: 0.8; }
.long-text-preview {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}
.full-text {
  white-space: pre-wrap;
  background: rgba(var(--v-theme-on-surface), 0.04);
  max-height: 320px;
  overflow: auto;
}
</style>
