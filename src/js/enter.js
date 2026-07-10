const STORAGE_KEY = '20026-entered'

export function initEnter() {
  const gate = document.getElementById('entry-gate')
  if (!gate) return

  const dismiss = () => {
    gate.hidden = true
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  if (sessionStorage.getItem(STORAGE_KEY) === '1') {
    gate.hidden = true
    return
  }

  gate.querySelectorAll('[data-action="enter"]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      dismiss()
    })
  })
}
