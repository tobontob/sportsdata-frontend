'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import LiveScore from '@/components/LiveScore'
import BettingOdds from '@/components/BettingOdds'
import BettingAnalysis from '@/components/BettingAnalysis'
import ChatRoom from '@/components/ChatRoom'

interface Match {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: string
  time: string
  league: string
  venue: string
}

export default function MatchDetail() {
  const params = useParams()
  const matchId = Number(params.id)
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/matches/${matchId}`)
        
        if (!response.ok) {
          throw new Error('경기 정보를 불러오지 못했습니다.')
        }
        
        const data = await response.json()
        setMatch(data)
      } catch (err) {
        console.error('경기 상세 정보 로딩 에러:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (matchId) {
      fetchMatchDetails()
    }
  }, [matchId])

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

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">경기를 찾을 수 없습니다</h1>
            <p className="text-gray-600">요청하신 경기 정보가 존재하지 않습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 경기 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {match.homeTeam} vs {match.awayTeam}
            </h1>
            <p className="text-gray-700 font-medium">{match.league}</p>
            <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mt-1">{match.venue}</p>
          </div>
          
          {/* 경기 스코어 표시 */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex justify-between items-center">
              <div className="flex-1 text-right">
                <span className="font-semibold text-lg text-gray-900">{match.homeTeam}</span>
              </div>
              <div className="mx-6 text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {match.homeScore} - {match.awayScore}
                </div>
                <div className="text-sm text-blue-600 font-semibold mt-1 bg-blue-50 px-2 py-1 rounded-full inline-block">
                  {match.status} {match.time}
                </div>
              </div>
              <div className="flex-1 text-left">
                <span className="font-semibold text-lg text-gray-900">{match.awayTeam}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 배팅 배당률 */}
          <div className="lg:col-span-1">
            <BettingOdds
              matchId={match.id}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
            />
          </div>

          {/* 경기 분석 */}
          <div className="lg:col-span-1">
            <BettingAnalysis
              matchId={match.id}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
            />
          </div>

          {/* 실시간 채팅 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">실시간 채팅</h3>
              <ChatRoom 
                matchId={String(match.id)} 
              />
            </div>
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 선수 명단 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">선수 명단</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">{match.homeTeam}</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>1. 데 헤아 (GK)</li>
                  <li>2. 달로트 (DF)</li>
                  <li>6. 마구이레 (DF)</li>
                  <li>19. 바란 (DF)</li>
                  <li>23. 쇼 (DF)</li>
                  <li>8. 브루노 (MF)</li>
                  <li>18. 카세미로 (MF)</li>
                  <li>21. 안토니 (MF)</li>
                  <li>10. 라시포드 (FW)</li>
                  <li>9. 마샬 (FW)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">{match.awayTeam}</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>1. 알리송 (GK)</li>
                  <li>66. 알렉산더-아놀드 (DF)</li>
                  <li>4. 반 다이크 (DF)</li>
                  <li>5. 코나테 (DF)</li>
                  <li>26. 로버트슨 (DF)</li>
                  <li>3. 파비뉴 (MF)</li>
                  <li>14. 헨더슨 (MF)</li>
                  <li>11. 살라 (MF)</li>
                  <li>9. 피르미누 (FW)</li>
                  <li>10. 마네 (FW)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 경기 통계 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">경기 통계</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-medium">점유율</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">45%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">55%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-medium">슈팅</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">8</span>
                  <span className="text-sm text-gray-400">-</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-medium">유효슈팅</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">3</span>
                  <span className="text-sm text-gray-400">-</span>
                  <span className="text-sm font-medium text-gray-900">5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-medium">코너킥</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">4</span>
                  <span className="text-sm text-gray-400">-</span>
                  <span className="text-sm font-medium text-gray-900">6</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-medium">옐로카드</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">2</span>
                  <span className="text-sm text-gray-400">-</span>
                  <span className="text-sm font-medium text-gray-900">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 