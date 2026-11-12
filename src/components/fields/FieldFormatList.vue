<script setup>
// Every format of a multi-format field. Click one to copy it; star one to make it the default.
import { mdiStar, mdiStarOutline } from '@mdi/js'
import { togglePreferredFormat } from '../../lib/store'
import { copyToClipboard } from '../../composables/useClipboard'

const props = defineProps({
  field: { type: Object, required: true },
  formats: { type: Array, required: true },
})

const isPreferred = (format) => props.field.preferredFormat === format.label
</script>

<template>
  <v-list density="compact" class="format-list py-0 mt-1 rounded">
    <v-list-item
      v-for="format in formats"
      :key="format.label"
      :title="format.value"
      :subtitle="format.label"
      @click="copyToClipboard(format.value)"
    >
      <template #append>
        <v-btn
          :icon="isPreferred(format) ? mdiStar : mdiStarOutline"
          :color="isPreferred(format) ? 'amber-darken-2' : undefined"
          size="x-small"
          title="Make this the default format"
          @click.stop="togglePreferredFormat(field.id, format.label)"
        />
      </template>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.format-list { background: rgba(var(--v-theme-on-surface), 0.04); }
.format-list :deep(.v-list-item-title) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8125rem;
}
</style>
