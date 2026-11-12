<script setup>
// The CtrlCVCV wordmark: [CTRL] [C] [V] outlined keys + an outlined CV document.
// variant="color" is indigo on light backgrounds (same as branding/logo.svg);
// variant="light" is white, for dark/indigo backgrounds such as the app bar.
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'color' },
  height: { type: [Number, String], default: 28 },
})

const c = computed(() => (props.variant === 'light'
  ? { ink: '#FFFFFF', fold: 'rgba(255,255,255,0.35)', lines: 'rgba(255,255,255,0.6)' }
  : { ink: '#3F51B5', fold: '#C5CAE9', lines: '#9FA8DA' }))

// Each key's outer edge spans y 8–61, the same as the document.
const keys = [
  { x: 5.5, w: 61, label: 'CTRL', size: 20, ty: 41.5 },
  { x: 74.5, w: 41, label: 'C', size: 36, ty: 47 },
  { x: 123.5, w: 41, label: 'V', size: 36, ty: 47 },
]
</script>

<template>
  <svg :height="height" viewBox="0 0 218 68" role="img" aria-label="CtrlCVCV" class="app-logo">
    <title>CtrlCVCV</title>
    <g fill="none" :stroke="c.ink" stroke-width="3" stroke-linejoin="round">
      <rect v-for="k in keys" :key="k.label" :x="k.x" y="9.5" :width="k.w" height="50" rx="4" />
      <path d="M172.5 13.5a4 4 0 0 1 4-4h21l15 15v31a4 4 0 0 1-4 4h-32a4 4 0 0 1-4-4z" />
      <path d="M197.5 9.5v11a4 4 0 0 0 4 4h11" :fill="c.fold" />
    </g>
    <g font-family="'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="700" text-anchor="middle" :fill="c.ink">
      <text v-for="k in keys" :key="k.label" :x="k.x + k.w / 2" :y="k.ty" :font-size="k.size">{{ k.label }}</text>
      <text x="192.5" y="40" font-size="20">CV</text>
    </g>
    <path d="M182 47.5h21M182 53.5h13" :stroke="c.lines" stroke-width="3" stroke-linecap="round" />
  </svg>
</template>

<style scoped>
.app-logo { display: block; width: auto; }
</style>
