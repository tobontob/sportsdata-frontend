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
  // 브라우저별 고유 user
  const [myUser] = useState(user + '_' + Math.random().toString(36).slice(2, 8))

  useEffect(() => {
    // 해당 경기 채팅방(room) join
    socket.emit('subscribe_match', Number(matchId))
    console.log("subscribe_match emit:", matchId)

    console.log("소켓 new_message 리스너 등록")
    socket.on('new_message', (msg: ChatMessage) => {
      setMessages((prev) => {
        // 중복 메시지 방지
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      })
    })
    socket.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history)
    })

    return () => {
      socket.emit('unsubscribe_match', Number(matchId))
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
      matchId: Number(matchId),
      user: myUser,
      message: input.trim(),
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, msg])
    socket.emit('chat_message', msg)
    setInput('')
  }

  // 내 메시지 판별 함수
  const isMyMessage = (msg: ChatMessage) => msg.user === myUser;

  return (
    <div className="flex flex-col h-full border rounded-lg p-4 bg-white shadow">
      {/* {console.log("렌더링 시 messages 상태:", messages)} */}
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center py-8">아직 메시지가 없습니다.</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 px-3 py-2 rounded-lg shadow-sm max-w-full w-fit
                ${isMyMessage(msg) ? 'bg-blue-200 text-blue-900 ml-auto' : 'bg-gray-200 text-gray-900 mr-auto'}
              `}
              style={{ wordBreak: 'break-all', textAlign: isMyMessage(msg) ? 'right' : 'left' }}
            >
              <span className={`font-semibold mr-2 ${isMyMessage(msg) ? 'text-blue-700' : 'text-gray-700'}`}>{msg.user}</span>
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
          className="flex-1 border border-gray-400 rounded px-2 py-1 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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