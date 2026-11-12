import { replaceState, resetState, stateSnapshot } from '../lib/store'
import { notify } from './useNotifier'

function downloadJSON(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

export function useBackup() {
  function exportBackup() {
    const date = new Date().toISOString().slice(0, 10)
    downloadJSON(stateSnapshot(), `ctrlcvcv-backup-${date}.json`)
  }

  async function importBackup(file) {
    try {
      const data = JSON.parse(await file.text())
      if (!Array.isArray(data?.fields)) throw new Error('No "fields" array found')
      replaceState(data)
      notify(`Imported ${data.fields.length} fields`)
    } catch (error) {
      notify(`Import failed: ${error.message}`)
    }
  }

  function resetToDefaults() {
    resetState()
    notify('Reset to default fields')
  }

  return { exportBackup, importBackup, resetToDefaults }
}
