'use client'

import { useParams } from 'next/navigation'
import ChatRoom from '@/components/ChatRoom'
import { LiveMatch } from '@/types/match'
import { useState, useEffect } from 'react'

export default function ChatPage() {
  const params = useParams()
  const matchId = parseInt(params.matchId as string)
  const [match, setMatch] = useState<LiveMatch | null>(null)

  useEffect(() => {
    // 실제로는 API에서 경기 정보를 가져와야 함
    // 현재는 목업 데이터 사용
    const mockMatch: LiveMatch = {
      id: matchId,
      homeTeam: "맨체스터 유나이티드",
      awayTeam: "리버풀",
      homeScore: 2,
      awayScore: 1,
      status: "live",
      time: "15:30",
      league: "프리미어 리그",
      date: "2024-01-15",
      minute: 67,
      events: []
    }
    setMatch(mockMatch)
  }, [matchId])

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  const matchTitle = `${match.homeTeam} vs ${match.awayTeam}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {matchTitle}
          </h1>
          <p className="text-gray-700 text-lg">
            실시간 채팅에 참여하여 경기를 함께 응원하세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 경기 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">경기 정보</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-700 font-medium">리그:</span>
                  <span className="font-semibold text-gray-900">{match.league}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-700 font-medium">상태:</span>
                  <span className={`font-semibold ${match.status === 'live' ? 'text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200' : 'text-gray-900'}`}>
                    {match.status === 'live' ? '진행 중' : '예정'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-700 font-medium">스코어:</span>
                  <span className="font-bold text-xl text-blue-600">
                    {match.homeScore} - {match.awayScore}
                  </span>
                </div>
                {match.status === 'live' && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-gray-700 font-medium">경기 시간:</span>
                    <span className="font-semibold text-green-600">{match.minute}'</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 채팅방 */}
          <div className="lg:col-span-2">
            <ChatRoom matchId={matchId} matchTitle={matchTitle} />
          </div>
        </div>
      </div>
    </div>
  )
} 