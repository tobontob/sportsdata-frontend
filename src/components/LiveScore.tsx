'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LiveMatch } from '@/types/match'

export default function LiveScore() {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = () => {
      fetch('/api/matches/live')
        .then(res => res.json())
        .then(data => {
          setMatches(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
    fetchMatches();
    const interval = setInterval(fetchMatches, 60000); // 1분마다 새로고침
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">실시간 경기</h2>
      {matches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-500 text-lg mb-2">현재 진행 중인 경기가 없습니다.</div>
          <p className="text-gray-400 text-sm">곧 새로운 경기가 시작될 예정입니다.</p>
        </div>
      ) : (
        matches.map((match) => (
          <div key={match.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">{match.league}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {match.status === 'live' ? `${match.minute}'` : match.time}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1 text-right">
                <span className="font-semibold text-lg text-gray-900">{match.homeTeam}</span>
              </div>
              <div className="mx-6 text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {match.homeScore} - {match.awayScore}
                </div>
                {match.status === 'live' && (
                  <div className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-full mt-1">LIVE</div>
                )}
              </div>
              <div className="flex-1 text-left">
                <span className="font-semibold text-lg text-gray-900">{match.awayTeam}</span>
              </div>
            </div>
            <div className="flex flex-row justify-center gap-2 mt-4">
              <Link
                href={`/match/${match.id}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1 rounded-full text-sm font-medium transition-colors"
              >
                상세
              </Link>
              <Link
                href={`/betting?matchId=${match.id}`}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full text-sm font-medium transition-colors"
              >
                배팅
              </Link>
              <Link
                href={`/chat/${match.id}`}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium transition-colors"
              >
                채팅
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  )
} 