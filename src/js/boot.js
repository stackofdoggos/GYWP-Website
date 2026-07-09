import { initMelt } from './melt.js'
import { initLazyMedia } from './lazy-media.js'
import { initScrollReveal } from './scroll-reveal.js'
import { initYoutubeFacade } from './youtube-facade.js'
import { initSpatialDialogue } from './spatial-dialogue.js'
import { initEnter } from './enter.js'
import { initChapterNav } from './chapter-nav.js'

const page = document.body.classList

if (page.contains('page--landing')) initMelt()
if (page.contains('page--hub')) initEnter()
if (document.querySelector('[data-lazy="true"]')) initLazyMedia()
if (document.querySelector('[data-reveal="scroll"]')) initScrollReveal()

initYoutubeFacade()
initSpatialDialogue()
initChapterNav()
