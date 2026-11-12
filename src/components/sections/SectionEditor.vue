<script setup>
// Dialog for adding a section, or renaming, re-iconing and deleting an existing one.
import { computed, ref, watch } from 'vue'
import { mdiDeleteOutline } from '@mdi/js'
import SectionIconPicker from './SectionIconPicker.vue'
import { DEFAULT_SECTION_ICON } from '../../lib/defaults'
import { fieldsInSection, state } from '../../lib/store'

const isOpen = defineModel({ type: Boolean, default: false })
const props = defineProps({
  section: { type: Object, default: null }, // null when adding a new section
})
const emit = defineEmits(['save', 'delete'])

const title = ref('')
const icon = ref(DEFAULT_SECTION_ICON)
const isConfirmingDelete = ref(false)
const fieldAction = ref('move') // what happens to the section's fields: 'move' | 'delete'
const moveFieldsTo = ref(null)

const isNew = computed(() => !props.section)
const otherSections = computed(() => state.sections.filter((section) => section.id !== props.section?.id))
const canDelete = computed(() => !isNew.value && otherSections.value.length > 0)
const fieldCount = computed(() => (props.section ? fieldsInSection(props.section.id).length : 0))
const fieldCountText = computed(() => `${fieldCount.value} field${fieldCount.value === 1 ? '' : 's'}`)
const hasTitle = computed(() => title.value.trim().length > 0)

// Start from the section's current values each time the dialog opens.
watch(isOpen, (open) => {
  if (!open) return
  title.value = props.section?.title ?? ''
  icon.value = props.section?.icon ?? DEFAULT_SECTION_ICON
  isConfirmingDelete.value = false
  fieldAction.value = 'move'
  moveFieldsTo.value = otherSections.value[0]?.id ?? null
}, { immediate: true })

const close = () => { isOpen.value = false }

function save() {
  if (!hasTitle.value) return
  emit('save', { title: title.value, icon: icon.value })
  close()
}

function confirmDelete() {
  const shouldMoveFields = fieldCount.value > 0 && fieldAction.value === 'move'
  emit('delete', { moveFieldsTo: shouldMoveFields ? moveFieldsTo.value : null })
  close()
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="420">
    <v-card :title="isNew ? 'Add section' : 'Edit section'">
      <v-card-text class="d-flex flex-column ga-4">
        <v-text-field
          v-model="title"
          label="Section name"
          autofocus
          :rules="[(value) => !!value?.trim() || 'Enter a name']"
          @keydown.enter="save"
        />

        <SectionIconPicker v-model="icon" />

        <template v-if="isConfirmingDelete">
          <v-divider />
          <div class="text-body-2">Delete “{{ section.title }}”?</div>
          <template v-if="fieldCount">
            <v-radio-group v-model="fieldAction" density="compact" hide-details>
              <v-radio value="move" :label="`Move its ${fieldCountText} to another section`" />
              <v-radio value="delete" :label="`Delete its ${fieldCountText} too`" />
            </v-radio-group>
            <v-select
              v-if="fieldAction === 'move'"
              v-model="moveFieldsTo"
              :items="otherSections"
              item-title="title"
              item-value="id"
              label="Move fields to"
            />
          </template>
          <div v-else class="text-caption text-medium-emphasis">This section has no fields.</div>
        </template>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <template v-if="!isConfirmingDelete">
          <v-btn v-if="canDelete" color="error" :prepend-icon="mdiDeleteOutline" @click="isConfirmingDelete = true">Delete</v-btn>
          <v-spacer />
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :disabled="!hasTitle" @click="save">{{ isNew ? 'Add' : 'Save' }}</v-btn>
        </template>
        <template v-else>
          <v-spacer />
          <v-btn @click="isConfirmingDelete = false">Keep section</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete">Delete section</v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
