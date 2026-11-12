import { notify } from './useNotifier'

const PREVIEW_LENGTH = 40

function copyWithTextarea(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

/** Copies text and shows "Copied …". `description` replaces the text preview (e.g. "Cover letter"). */
export async function copyToClipboard(text, description = '') {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // The Clipboard API can be unavailable or denied.
    copyWithTextarea(text)
  }
  const preview = text.length > PREVIEW_LENGTH ? `${text.slice(0, PREVIEW_LENGTH)}…` : text
  notify(description ? `Copied ${description}` : `Copied “${preview}”`)
}

export function useClipboard() {
  return { copyToClipboard }
}
