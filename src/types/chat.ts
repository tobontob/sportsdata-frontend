export interface ChatMessage {
  id: string
  matchId: number
  userId: string
  username: string
  message: string
  timestamp: Date
  type: 'message' | 'system' | 'goal' | 'card'
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