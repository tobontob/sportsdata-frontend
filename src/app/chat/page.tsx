'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LiveMatch } from '@/types/match'

export default function ChatListPage() {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])

  useEffect(() => {
    // 실제로는 API에서 실시간 경기 목록을 가져와야 함
    const mockMatches: LiveMatch[] = [
      {
        id: 1,
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
      },
      {
        id: 2,
        homeTeam: "바르셀로나",
        awayTeam: "레알 마드리드",
        homeScore: 0,
        awayScore: 0,
        status: "live",
        time: "16:00",
        league: "라 리가",
        date: "2024-01-15",
        minute: 34,
        events: []
      }
    ]
    setLiveMatches(mockMatches)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            실시간 채팅
          </h1>
          <p className="text-gray-700 text-lg">
            진행 중인 경기의 실시간 채팅에 참여하세요
          </p>
        </div>

        {liveMatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-gray-500 mb-4">
              <span className="text-4xl">💬</span>
            </div>
            <p className="text-gray-600 text-lg mb-2">현재 진행 중인 경기가 없습니다.</p>
            <p className="text-sm text-gray-500">경기가 시작되면 채팅방이 열립니다.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {liveMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {match.homeTeam} vs {match.awayTeam}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {match.league}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {match.homeScore} - {match.awayScore}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">스코어</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                          {match.minute}' LIVE
                        </div>
                        <div className="text-sm text-gray-600 mt-1">경기 시간</div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/chat/${match.id}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  >
                    💬 채팅 참여
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 