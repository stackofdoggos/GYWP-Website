import { fetchScoreboard, seasonTypeLabel, SEASON_TYPES } from './nfl-api.js'

const DEFAULT_YEAR = 2025
const DEFAULT_WEEK = 1
const DEFAULT_SEASON_TYPE = 2

export function initDashboard() {
  const root = document.querySelector('.dashboard')
  if (!root) return

  const weekLabel = root.querySelector('#week-label')
  const weekPrev = root.querySelector('#week-prev')
  const weekNext = root.querySelector('#week-next')
  const seasonTypeSelect = root.querySelector('#season-type')
  const seasonYearSelect = root.querySelector('#season-year')
  const gamesList = root.querySelector('#games-list')
  const statusLine = root.querySelector('#dashboard-status')

  if (!gamesList || !weekLabel) return

  const state = {
    week: DEFAULT_WEEK,
    seasonType: DEFAULT_SEASON_TYPE,
    year: DEFAULT_YEAR,
  }

  populateSeasonYears(seasonYearSelect)
  populateSeasonTypes(seasonTypeSelect)

  seasonTypeSelect.value = String(state.seasonType)
  seasonYearSelect.value = String(state.year)

  weekPrev?.addEventListener('click', () => {
    state.week = Math.max(1, state.week - 1)
    loadGames()
  })

  weekNext?.addEventListener('click', () => {
    state.week += 1
    loadGames()
  })

  seasonTypeSelect?.addEventListener('change', () => {
    state.seasonType = Number(seasonTypeSelect.value)
    state.week = 1
    loadGames()
  })

  seasonYearSelect?.addEventListener('change', () => {
    state.year = Number(seasonYearSelect.value)
    state.week = 1
    loadGames()
  })

  loadGames()

  async function loadGames() {
    gamesList.innerHTML = '<p class="dashboard__message">Loading games…</p>'
    if (statusLine) statusLine.textContent = ''

    try {
      const data = await fetchScoreboard({
        week: state.week,
        seasonType: state.seasonType,
        year: state.year,
      })

      if (data.week) state.week = data.week
      if (data.seasonYear) state.year = data.seasonYear

      weekLabel.textContent = `${seasonTypeLabel(state.seasonType)} · Week ${state.week}`
      seasonYearSelect.value = String(state.year)

      if (!data.events.length) {
        gamesList.innerHTML =
          '<p class="dashboard__message">No games scheduled for this week.</p>'
        return
      }

      gamesList.innerHTML = data.events.map(renderGameCard).join('')

      if (statusLine) {
        statusLine.textContent = `${data.events.length} games · ${state.year} normal-era schedule`
      }
    } catch (error) {
      gamesList.innerHTML =
        '<p class="dashboard__message dashboard__message--error">Could not load NFL games. Try another week.</p>'
      if (statusLine) statusLine.textContent = error.message
    }
  }
}

function populateSeasonYears(select) {
  if (!select) return
  const current = new Date().getFullYear()
  select.innerHTML = ''
  for (let year = current + 1; year >= 2015; year -= 1) {
    const option = document.createElement('option')
    option.value = String(year)
    option.textContent = String(year)
    select.appendChild(option)
  }
}

function populateSeasonTypes(select) {
  if (!select) return
  select.innerHTML = SEASON_TYPES.map(
    (entry) => `<option value="${entry.value}">${entry.label}</option>`,
  ).join('')
}

function renderGameCard(game) {
  const when = formatGameDate(game.date)
  const location = [game.venue, game.city, game.state].filter(Boolean).join(' · ')
  const showScore = game.state !== 'pre'

  return `
    <article class="game-card" data-state="${game.state}">
      <header class="game-card__header">
        <span class="game-card__status">${escapeHtml(game.detail || game.status)}</span>
        <time class="game-card__time" datetime="${game.date}">${escapeHtml(when)}</time>
      </header>
      <div class="game-card__matchup">
        ${renderTeam(game.away, showScore)}
        <span class="game-card__at">at</span>
        ${renderTeam(game.home, showScore)}
      </div>
      ${location ? `<p class="game-card__venue">${escapeHtml(location)}</p>` : ''}
    </article>
  `
}

function renderTeam(team, showScore) {
  const logo = team.logo
    ? `<img class="game-card__logo" src="${team.logo}" alt="" width="32" height="32" loading="lazy" referrerpolicy="no-referrer" />`
    : ''

  return `
    <div class="game-card__team">
      ${logo}
      <span class="game-card__name">${escapeHtml(team.name)}</span>
      ${showScore ? `<span class="game-card__score">${escapeHtml(String(team.score))}</span>` : ''}
    </div>
  `
}

function formatGameDate(isoDate) {
  const date = new Date(isoDate)
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
