<script setup>
// Use page: switch between full values and compact copy buttons. Saved with the rest of the data.
import { mdiGestureTapButton, mdiViewAgendaOutline } from '@mdi/js'
import { state } from '../../lib/store'
</script>

<template>
  <v-btn-toggle v-model="state.useView" mandatory density="compact" variant="outlined" divided color="primary">
    <v-btn value="values" :icon="mdiViewAgendaOutline" title="Show values" aria-label="Show values" />
    <v-btn value="buttons" :icon="mdiGestureTapButton" title="Show copy buttons" aria-label="Show copy buttons" />
  </v-btn-toggle>
</template>
