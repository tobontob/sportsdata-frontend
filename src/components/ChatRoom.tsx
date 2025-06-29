'use client'

import { useState, useEffect, useRef } from 'react'
import socket from '@/lib/socket'
import { ChatMessage, User } from '@/types/chat'

interface ChatRoomProps {
  matchId: number
  matchTitle: string
}

export default function ChatRoom({ matchId, matchTitle }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<User>({
    id: `user_${Math.random().toString(36).substr(2, 9)}`,
    username: `User${Math.floor(Math.random() * 1000)}`
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // 경기 채팅방 입장
    socket.emit('subscribe_match', matchId)

    // 메시지 수신
    socket.on('new_message', (message: ChatMessage) => {
      if (message.matchId === matchId) {
        setMessages(prev => [...prev, message])
      }
    })

    // 시스템 메시지 (골, 카드 등)
    socket.on('match_event', (event: any) => {
      if (event.matchId === matchId) {
        const systemMessage: ChatMessage = {
          id: `event_${Date.now()}`,
          matchId,
          userId: 'system',
          username: '시스템',
          message: `${event.type === 'goal' ? '⚽' : '🟨'} ${event.player} ${event.type === 'goal' ? '골!' : '옐로카드'}`,
          timestamp: new Date(),
          type: event.type
        }
        setMessages(prev => [...prev, systemMessage])
      }
    })

    return () => {
      socket.emit('unsubscribe_match', matchId)
      socket.off('new_message')
      socket.off('match_event')
    }
  }, [matchId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      matchId,
      userId: user.id,
      username: user.username,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'message'
    }

    socket.emit('chat_message', message)
    setNewMessage('')
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-96 flex flex-col border border-gray-200">
      {/* 채팅방 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold text-white">{matchTitle}</h3>
        <p className="text-sm text-blue-100">실시간 채팅</p>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">아직 메시지가 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1">첫 번째 메시지를 남겨보세요!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.userId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg shadow-sm ${
                  msg.type === 'system'
                    ? 'bg-yellow-100 text-yellow-800 text-center w-full border border-yellow-200'
                    : msg.userId === user.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                {msg.type !== 'system' && (
                  <div className="text-xs opacity-75 mb-1 font-medium">{msg.username}</div>
                )}
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs opacity-75 mt-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  )
} 