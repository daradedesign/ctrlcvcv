<script setup>
// Use page, button view: a compact button with the field's icon and label. Click to copy.
import { computed } from 'vue'
import { fieldIcon } from '../../lib/fieldIcons'
import { isMultiFormat } from '../../lib/defaults'
import { useFieldFormats } from '../../composables/useFields'
import { copyToClipboard } from '../../composables/useClipboard'

const props = defineProps({
  field: { type: Object, required: true },
})

const { primaryFormat } = useFieldFormats(() => props.field)
const icon = computed(() => fieldIcon(props.field))

// Hovering shows what will be copied.
const tooltip = computed(() => {
  if (!primaryFormat.value) return props.field.label
  const format = isMultiFormat(props.field.type) ? ` · ${primaryFormat.value.label}` : ''
  return `Copy ${props.field.label}${format}:\n${primaryFormat.value.value}`
})

function copy() {
  if (!primaryFormat.value) return
  const isLongText = props.field.type === 'long'
  copyToClipboard(primaryFormat.value.value, isLongText ? props.field.label : '')
}
</script>

<template>
  <v-btn
    variant="tonal"
    color="primary"
    size="small"
    class="field-button text-none"
    :prepend-icon="icon"
    :title="tooltip"
    @click="copy"
  >
    <span class="text-truncate">{{ field.label }}</span>
  </v-btn>
</template>

<style scoped>
.field-button { max-width: 100%; justify-content: flex-start; }
.field-button :deep(.v-btn__content) { min-width: 0; }
</style>
