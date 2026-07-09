import { prefersReducedMotion } from './utils.js'

function expandRepeatPhrase(repeatEl) {
  const phrase = repeatEl.dataset.repeatPhrase ?? 'Something is terribly wrong.'
  const target = Number.parseInt(repeatEl.dataset.repeatCount ?? '30', 10)
  const current = repeatEl.textContent.split(phrase).length - 1

  if (current >= target) return

  const extra = Array.from({ length: target - current }, () => phrase).join(' ')
  repeatEl.textContent = `${repeatEl.textContent.trim()} ${extra}`
}

function wrapMeltLetters(repeatEl) {
  const text = repeatEl.textContent
  repeatEl.textContent = ''

  for (const char of text) {
    const span = document.createElement('span')
    span.className = 'melt-letter'
    span.textContent = char === ' ' ? '\u00a0' : char
    repeatEl.appendChild(span)
  }
}

function scatterLetters(repeatEl) {
  const letters = repeatEl.querySelectorAll('.melt-letter')

  letters.forEach((letter, index) => {
    window.setTimeout(() => {
      const x = (Math.random() - 0.5) * 10
      const y = (Math.random() - 0.5) * 8
      const rotation = (Math.random() - 0.5) * 20
      letter.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`
      letter.style.opacity = String(0.65 + Math.random() * 0.35)
    }, index * 15)
  })
}

export function initMelt() {
  const body = document.body
  const meltZone = document.querySelector('.melt-zone')
  const articleShell = document.querySelector('.article-shell')
  const reveal = document.getElementById('entered')

  if (!meltZone || !articleShell || !reveal) return
  if (location.hash === '#entered') return

  let triggered = false
  let completed = false

  const completeMelt = () => {
    if (completed) return
    completed = true

    body.classList.remove('is-melting')
    body.classList.add('is-melted')
    location.hash = 'entered'
    reveal.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const startMelt = () => {
    if (triggered) return
    triggered = true

    if (prefersReducedMotion()) {
      completeMelt()
      return
    }

    const repeatEl = meltZone.querySelector('.melt-zone__repeat')
    if (repeatEl) {
      expandRepeatPhrase(repeatEl)
      wrapMeltLetters(repeatEl)
      scatterLetters(repeatEl)
    }

    body.classList.add('is-melting')

    const onAnimationEnd = (event) => {
      if (event.animationName === 'melt-disintegrate') {
        articleShell.removeEventListener('animationend', onAnimationEnd)
        completeMelt()
      }
    }

    articleShell.addEventListener('animationend', onAnimationEnd)
    window.setTimeout(completeMelt, 5000)
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      startMelt()
    },
    { threshold: 0.15 },
  )

  observer.observe(meltZone)
  window.setTimeout(startMelt, 50000)
}
