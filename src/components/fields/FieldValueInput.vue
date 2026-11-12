<script setup>
// The inputs for a field's value, which depend on its type.
import { useTemplateRef } from 'vue'
import { CURRENCIES, HOURS_PER_YEAR, JOB_DETAIL_FIELDS, placeholderToken } from '../../lib/formats'

const value = defineModel({ type: Object, required: true })
defineProps({
  type: { type: String, required: true },
  hint: { type: String, default: '' },
})

const textareaComponent = useTemplateRef('textarea')

function update(key, newValue) {
  value.value = { ...value.value, [key]: newValue }
}

/** Inserts {{key}} at the cursor in the long-text box (or at the end) and keeps the cursor after it. */
function insertPlaceholder(key) {
  const textarea = textareaComponent.value?.$el.querySelector('textarea')
  const token = placeholderToken(key)
  const text = value.value.text ?? ''
  const start = textarea?.selectionStart ?? text.length
  const end = textarea?.selectionEnd ?? text.length
  update('text', text.slice(0, start) + token + text.slice(end))
  requestAnimationFrame(() => {
    const cursor = start + token.length
    textarea?.focus()
    textarea?.setSelectionRange(cursor, cursor)
  })
}
</script>

<template>
  <v-text-field
    v-if="type === 'url' || type === 'short'"
    :model-value="value.text"
    :label="type === 'url' ? 'URL' : 'Value'"
    :placeholder="hint"
    :type="type === 'url' ? 'url' : 'text'"
    clearable
    @update:model-value="update('text', $event ?? '')"
  />

  <template v-else-if="type === 'long'">
    <div class="d-flex flex-wrap align-center ga-1">
      <span class="text-caption text-medium-emphasis mr-1">Insert:</span>
      <v-chip v-for="detail in JOB_DETAIL_FIELDS" :key="detail.key" size="small" @click="insertPlaceholder(detail.key)">
        {{ detail.label }}
      </v-chip>
      <v-chip size="small" @click="insertPlaceholder('date')">Today's date</v-chip>
    </div>
    <v-textarea
      ref="textarea"
      :model-value="value.text"
      label="Text"
      rows="12"
      auto-grow
      counter
      :placeholder="hint"
      @update:model-value="update('text', $event)"
    />
  </template>

  <template v-else-if="type === 'phone'">
    <div class="d-flex ga-2">
      <v-text-field
        :model-value="value.countryCode"
        label="Country code"
        prefix="+"
        class="country-code"
        inputmode="numeric"
        @update:model-value="update('countryCode', $event)"
      />
      <v-text-field
        :model-value="value.number"
        label="Phone number"
        placeholder="555 123 4567"
        inputmode="tel"
        @update:model-value="update('number', $event)"
      />
    </div>
    <v-text-field
      :model-value="value.extension"
      label="Extension (optional)"
      inputmode="numeric"
      @update:model-value="update('extension', $event)"
    />
  </template>

  <template v-else-if="type === 'salary'">
    <v-select :model-value="value.currency" :items="CURRENCIES" label="Currency" @update:model-value="update('currency', $event)" />
    <div class="d-flex ga-2">
      <v-text-field
        :model-value="value.amount"
        type="number"
        label="Annual amount"
        min="0"
        step="1000"
        @update:model-value="update('amount', $event === '' ? null : Number($event))"
      />
      <v-text-field
        :model-value="value.max"
        type="number"
        label="Range max (optional)"
        min="0"
        step="1000"
        @update:model-value="update('max', $event === '' ? null : Number($event))"
      />
    </div>
    <div class="text-caption text-medium-emphasis">
      Hourly and monthly equivalents assume {{ HOURS_PER_YEAR.toLocaleString() }} working hours a year.
    </div>
  </template>

  <template v-else-if="type === 'date'">
    <v-switch
      :model-value="value.today"
      label="Always use today's date"
      color="primary"
      density="compact"
      hide-details
      @update:model-value="update('today', $event)"
    />
    <v-text-field
      v-if="!value.today"
      :model-value="value.iso"
      type="date"
      label="Date"
      @update:model-value="update('iso', $event)"
    />
  </template>
</template>

<style scoped>
.country-code { max-width: 120px; }
</style>
