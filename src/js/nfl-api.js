const ESPN_SCOREBOARD = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'

export async function fetchScoreboard({ week, seasonType = 2, year, dates } = {}) {
  const params = new URLSearchParams()

  if (dates) {
    params.set('dates', dates)
  } else {
    if (week != null) params.set('week', String(week))
    params.set('seasontype', String(seasonType))
    if (year != null) params.set('year', String(year))
  }

  const response = await fetch(`${ESPN_SCOREBOARD}?${params}`)
  if (!response.ok) throw new Error(`NFL feed unavailable (${response.status})`)

  const data = await response.json()
  return {
    week: data.week?.number ?? week,
    seasonYear: data.season?.year ?? year,
    seasonType: data.season?.type ?? seasonType,
    events: (data.events ?? []).map(parseEvent),
  }
}

function parseEvent(event) {
  const competition = event.competitions?.[0] ?? {}
  const home = competition.competitors?.find((team) => team.homeAway === 'home')
  const away = competition.competitors?.find((team) => team.homeAway === 'away')
  const status = competition.status?.type ?? event.status?.type ?? {}

  return {
    id: event.id,
    name: event.name,
    shortName: event.shortName,
    date: event.date,
    week: event.week?.number,
    venue: competition.venue?.fullName ?? '',
    city: competition.venue?.address?.city ?? '',
    state: competition.venue?.address?.state ?? '',
    status: status.description ?? 'Scheduled',
    state: status.state ?? 'pre',
    detail: status.detail ?? status.shortDetail ?? '',
    home: parseTeam(home),
    away: parseTeam(away),
  }
}

function parseTeam(competitor) {
  if (!competitor?.team) {
    return { name: 'TBD', abbr: 'TBD', score: '-', logo: '' }
  }

  const { team, score } = competitor
  const abbr = (team.abbreviation ?? '').toLowerCase()
  const logo =
    team.logo ??
    team.logos?.find((entry) => entry.rel?.includes('default'))?.href ??
    team.logos?.[0]?.href ??
    (abbr ? `${import.meta.env.BASE_URL}nfl-logos/${abbr}.png` : '')

  return {
    name: team.displayName ?? team.name,
    abbr: team.abbreviation ?? '',
    score: score ?? '0',
    logo,
    color: team.color ? `#${team.color}` : null,
  }
}

export const SEASON_TYPES = [
  { value: 1, label: 'Preseason' },
  { value: 2, label: 'Regular Season' },
  { value: 3, label: 'Postseason' },
]

export function seasonTypeLabel(type) {
  return SEASON_TYPES.find((entry) => entry.value === type)?.label ?? 'Season'
}
