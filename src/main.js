import { createApp } from 'vue'
import 'vuetify/styles'
import './styles/global.css'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import { initStore, state } from './lib/store'

await initStore()
// Set the saved theme before the first render to avoid a flash of the light theme.
vuetify.theme.change(state.theme || 'light')

createApp(App).use(vuetify).mount('#app')
