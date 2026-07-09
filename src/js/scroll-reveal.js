import { prefersReducedMotion } from './utils.js'

export function initScrollReveal() {
  if (prefersReducedMotion()) return

  const items = document.querySelectorAll('[data-reveal="scroll"]')
  if (!items.length) return

  items.forEach((el) => {
    el.style.opacity = '0'
    el.style.transition = 'opacity 400ms ease'
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.style.opacity = '1'
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.08 },
  )

  items.forEach((el) => observer.observe(el))
}
