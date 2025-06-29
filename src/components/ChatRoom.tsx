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
    const msg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      matchId,
      user,
      message: input.trim(),
      timestamp: Date.now(),
    }
    socket.emit('chat_message', msg)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full border rounded-lg p-4 bg-white shadow">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center py-8">아직 메시지가 없습니다.</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="mb-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 shadow-sm w-fit max-w-full"
              style={{ wordBreak: 'break-all' }}
            >
              <span className="font-semibold text-blue-700 mr-2">{msg.user}</span>
              <span>{msg.message}</span>
              <span className="text-xs text-gray-500 ml-2 align-bottom">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
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