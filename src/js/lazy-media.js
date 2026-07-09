export function initLazyMedia() {
  const images = document.querySelectorAll('.media[data-lazy="true"] img[data-src]')
  if (!images.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute('data-src')
        observer.unobserve(img)
      })
    },
    { rootMargin: '200px' },
  )

  images.forEach((img) => observer.observe(img))
}
