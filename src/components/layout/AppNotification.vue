<script setup>
import { useNotifier } from '../../composables/useNotifier'

const NOTIFICATION_TIMEOUT_MS = 1600
const { notification } = useNotifier()
</script>

<template>
  <v-snackbar v-model="notification.visible" :timeout="NOTIFICATION_TIMEOUT_MS" location="bottom" color="primary">
    {{ notification.message }}
  </v-snackbar>
</template>
