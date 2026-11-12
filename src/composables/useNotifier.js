import { reactive } from 'vue'

// One app-wide snackbar message.
const notification = reactive({ visible: false, message: '' })

export function notify(message) {
  notification.message = message
  notification.visible = true
}

export function useNotifier() {
  return { notification, notify }
}
