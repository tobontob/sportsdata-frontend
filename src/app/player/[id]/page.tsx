'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Player {
  id: number
  name: string
  team: string
  teamId: number
  position: string
  number: number
  nationality: string
  age: number
  height: string
  weight: string
  appearances: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  photoUrl: string
  recentMatches: RecentMatch[]
}

interface RecentMatch {
  id: number
  date: string
  opponent: string
  isHome: boolean
  result: 'W' | 'D' | 'L'
  goals: number
  assists: number
  minutes: number
}

export default function PlayerDetail() {
  const params = useParams()
  const playerId = Number(params.id)
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/players/${playerId}`)
        if (!response.ok) {
          throw new Error('선수 정보를 불러오지 못했습니다.')
        }
        const data = await response.json()
        setPlayer(data)
      } catch (err) {
        console.error('선수 상세 정보 로딩 에러:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    if (playerId) {
      fetchPlayerDetails()
    }
  }, [playerId])

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">선수를 찾을 수 없습니다</h1>
            <p className="text-gray-600">요청하신 선수 정보가 존재하지 않습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 선수 프로필 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 flex items-center space-x-8">
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{player.name}</h1>
            <p className="text-gray-700 font-medium mb-1">{player.team} • {player.position} • {player.number}번</p>
            <p className="text-sm text-gray-500">국적: {player.nationality} • 나이: {player.age}세</p>
            <p className="text-sm text-gray-500">신장: {player.height} • 체중: {player.weight}</p>
            <Link href={`/team/${player.teamId}`} className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">팀 상세 보기</Link>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{player.goals}골</div>
            <div className="text-sm text-gray-600">{player.assists}도움</div>
          </div>
        </div>

        {/* 주요 기록 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
            <div className="text-lg font-bold text-blue-700 mb-1">{player.appearances}</div>
            <div className="text-sm text-blue-900">경기 출장</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
            <div className="text-lg font-bold text-green-700 mb-1">{player.goals}</div>
            <div className="text-sm text-green-900">득점</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 text-center">
            <div className="text-lg font-bold text-purple-700 mb-1">{player.assists}</div>
            <div className="text-sm text-purple-900">도움</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-center">
            <div className="text-lg font-bold text-yellow-700 mb-1">{player.yellowCards}</div>
            <div className="text-sm text-yellow-900">경고</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200 text-center">
            <div className="text-lg font-bold text-red-700 mb-1">{player.redCards}</div>
            <div className="text-sm text-red-900">퇴장</div>
          </div>
        </div>

        {/* 최근 경기 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 경기</h3>
          <div className="space-y-3">
            {player.recentMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {match.isHome ? 'vs ' : '@ '}{match.opponent}
                  </div>
                  <div className="text-xs text-gray-500">{match.date}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    match.result === 'W' ? 'bg-green-500' : match.result === 'D' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {match.result}
                  </span>
                  <span className="text-xs text-gray-700">{match.goals}골 {match.assists}도움</span>
                  <span className="text-xs text-gray-500">{match.minutes}분</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 