<script setup>
const isOpen = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['confirm'])

function confirm() {
  emit('confirm')
  isOpen.value = false
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="360">
    <v-card
      title="Reset to defaults?"
      text="This replaces all of your saved fields, cover letters and job details with the default empty list. Export a backup first if you want to keep them."
    >
      <v-card-actions>
        <v-spacer />
        <v-btn @click="isOpen = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="confirm">Reset</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
