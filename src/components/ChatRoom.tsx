'use client'

import React, { useEffect, useRef, useState } from 'react'
import socket from '@/lib/socket'
import type { ChatMessage } from '@/types/chat'

interface ChatRoomProps {
  matchId: string
  user?: string
}

const ChatRoom: React.FC<ChatRoomProps> = ({ matchId, user = '익명' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 해당 경기 채팅방(room) join
    socket.emit('subscribe_match', matchId)

    // 기존 메시지 히스토리 수신
    socket.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history)
    })

    // 실시간 메시지 수신
    socket.on('new_message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.emit('unsubscribe_match', matchId)
      socket.off('chat_history')
      socket.off('new_message')
    }
  }, [matchId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const msg: Omit<ChatMessage, 'id' | 'timestamp'> = {
      matchId,
      user,
      message: input.trim(),
    }
    socket.emit('chat_message', msg)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full border rounded-lg p-4 bg-white shadow">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <span className="font-bold text-blue-600">{msg.user}:</span> {msg.message}
            <span className="text-xs text-gray-400 ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  )
}

export default ChatRoom 