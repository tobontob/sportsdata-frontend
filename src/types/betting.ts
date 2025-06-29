export interface BettingOdds {
  id: string
  matchId: number
  bookmaker: string
  homeWin: number
  draw: number
  awayWin: number
  lastUpdate: Date
}

export interface BettingMarket {
  id: string
  name: string
  key: string
  outcomes: BettingOutcome[]
}

export interface BettingOutcome {
  name: string
  price: number
  point?: number
}

export interface MatchBetting {
  matchId: number
  homeTeam: string
  awayTeam: string
  markets: BettingMarket[]
  bookmakers: string[]
  lastUpdate: Date
}

export interface BettingAnalysis {
  matchId: number
  homeForm: string
  awayForm: string
  headToHead: string
  prediction: string
  confidence: number
} 