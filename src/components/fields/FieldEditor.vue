<script setup>
// Full-screen dialog for adding or editing a field. Changes apply only on Save.
import { computed, ref, toRaw, watch } from 'vue'
import { mdiClose, mdiDeleteOutline } from '@mdi/js'
import FieldValueInput from './FieldValueInput.vue'
import { FIELD_TYPES, TEXT_FIELD_TYPES, emptyValueFor, isMultiFormat } from '../../lib/defaults'
import { state } from '../../lib/store'
import { useFieldFormats } from '../../composables/useFields'

const isOpen = defineModel({ type: Boolean, default: false })
const props = defineProps({
  field: { type: Object, default: null },
  isNew: { type: Boolean, default: false },
})
const emit = defineEmits(['save', 'delete'])

const draft = ref(null)
const isConfirmingDelete = ref(false)
const { formats: previewFormats } = useFieldFormats(draft)
const showPreview = computed(() => isMultiFormat(draft.value?.type) && previewFormats.value.length > 0)

// Start from a fresh copy each time the dialog opens.
watch(() => [isOpen.value, props.field], ([open, field]) => {
  if (!open || !field) return
  draft.value = structuredClone(toRaw(field))
  isConfirmingDelete.value = false
}, { immediate: true })

function onTypeChange(newType) {
  // Keep the text when switching between text types; other types start empty.
  const keepText = TEXT_FIELD_TYPES.includes(newType) && 'text' in draft.value.value
  if (!keepText) draft.value.value = emptyValueFor(newType)
  draft.value.preferredFormat = undefined
}

const close = () => { isOpen.value = false }

function save() {
  if (!draft.value.label?.trim()) draft.value.label = 'Untitled field'
  emit('save', draft.value)
  close()
}

function confirmDelete() {
  emit('delete', draft.value.id)
  close()
}
</script>

<template>
  <v-dialog v-model="isOpen" fullscreen scrollable>
    <v-card v-if="draft">
      <v-toolbar density="compact" color="primary">
        <v-btn :icon="mdiClose" title="Close without saving" @click="close" />
        <v-toolbar-title class="text-subtitle-1">{{ isNew ? 'Add field' : 'Edit field' }}</v-toolbar-title>
        <v-btn variant="flat" color="surface" class="mr-2" @click="save">Save</v-btn>
      </v-toolbar>

      <v-card-text class="editor-body d-flex flex-column ga-3 pt-4">
        <v-text-field v-model="draft.label" label="Label" autofocus />
        <v-select v-model="draft.section" :items="state.sections" item-title="title" item-value="id" label="Section" />
        <v-select v-model="draft.type" :items="FIELD_TYPES" label="Type" @update:model-value="onTypeChange" />

        <FieldValueInput v-model="draft.value" :type="draft.type" :hint="draft.hint" />

        <v-text-field v-model="draft.hint" label="Hint / placeholder (optional)" />

        <div v-if="showPreview">
          <div class="text-overline">Preview · {{ previewFormats.length }} formats</div>
          <div class="d-flex flex-wrap ga-1">
            <v-chip v-for="format in previewFormats" :key="format.label" size="small" :title="format.label">
              {{ format.value }}
            </v-chip>
          </div>
        </div>
      </v-card-text>

      <v-card-actions v-if="!isNew" class="px-4 pb-4">
        <v-btn v-if="!isConfirmingDelete" color="error" :prepend-icon="mdiDeleteOutline" @click="isConfirmingDelete = true">
          Delete field
        </v-btn>
        <template v-else>
          <span class="text-body-2">Delete “{{ draft.label }}”?</span>
          <v-spacer />
          <v-btn @click="isConfirmingDelete = false">Keep</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete">Delete</v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Vuetify inputs are flex: 1 1 auto, which stretches them vertically in a column. */
.editor-body > :deep(*) { flex: 0 0 auto; }
</style>
