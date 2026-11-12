<script setup>
defineProps({
  query: { type: String, required: true },
})
</script>

<template>
  <div class="text-center text-medium-emphasis pa-6">No fields match “{{ query }}”.</div>
</template>
