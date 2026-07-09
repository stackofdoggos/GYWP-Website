export function initChapterNav() {
  if (document.body.classList.contains('page--chapter')) {
    history.scrollRestoration = 'manual'
  }

  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLElement) {
      const tag = event.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) return
    }

    const nav = document.querySelector('.chapter-nav')
    if (!nav) return

    const prev = nav.querySelector('[rel="prev"]')
    const next = nav.querySelector('[rel="next"]')

    if ((event.key === 'k' || event.key === 'ArrowLeft') && prev instanceof HTMLAnchorElement) {
      event.preventDefault()
      window.location.href = prev.href
    }

    if ((event.key === 'j' || event.key === 'ArrowRight') && next instanceof HTMLAnchorElement) {
      event.preventDefault()
      window.location.href = next.href
    }
  })
}
