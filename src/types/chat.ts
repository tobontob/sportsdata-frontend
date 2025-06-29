export interface ChatMessage {
  id: string
  matchId: number
  user: string
  message: string
  timestamp: number
}

export interface ChatRoom {
  matchId: number
  matchTitle: string
  participantCount: number
  isActive: boolean
}

export interface User {
  id: string
  username: string
  avatar?: string
} 