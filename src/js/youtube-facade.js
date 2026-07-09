export function initYoutubeFacade() {
  document.querySelectorAll('.youtube-facade').forEach((facade) => {
    const button = facade.querySelector('.youtube-facade__play')
    if (!button) return

    button.addEventListener('click', () => {
      const videoId = facade.dataset.videoId
      const title = facade.dataset.title ?? 'Video'
      if (!videoId) return

      const iframe = document.createElement('iframe')
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`
      iframe.title = title
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      iframe.allowFullscreen = true
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;'

      facade.replaceChildren(iframe)
    })
  })
}
