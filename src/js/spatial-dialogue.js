export function initSpatialDialogue() {
  document.querySelectorAll('.dialogue--spatial[data-indent]').forEach((el) => {
    el.style.setProperty('--indent', el.dataset.indent)
  })

  document.querySelectorAll('.dialogue--placed').forEach((el) => {
    if (el.dataset.x) el.style.setProperty('--x', el.dataset.x)
    if (el.dataset.y) el.style.setProperty('--y', el.dataset.y)
  })
}
