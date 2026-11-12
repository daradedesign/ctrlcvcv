import { computed, watchEffect } from 'vue'
import { useTheme } from 'vuetify'
import { state } from '../lib/store'

export function useAppTheme() {
  const vuetifyTheme = useTheme()
  const isDark = computed(() => state.theme === 'dark')

  function toggleTheme() {
    state.theme = isDark.value ? 'light' : 'dark'
  }

  /** Keeps Vuetify's theme in step with the saved one, including after import or reset. */
  function syncThemeWithState() {
    watchEffect(() => vuetifyTheme.change(state.theme || 'light'))
  }

  return { isDark, toggleTheme, syncThemeWithState }
}
