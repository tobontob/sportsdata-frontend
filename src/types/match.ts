export interface Match {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: 'scheduled' | 'live' | 'finished'
  time: string
  league: string
  date: string
}

export interface LiveMatch extends Match {
  minute: number
  events: MatchEvent[]
}

export interface MatchEvent {
  id: number
  type: 'goal' | 'card' | 'substitution'
  minute: number
  player: string
  team: 'home' | 'away'
} 