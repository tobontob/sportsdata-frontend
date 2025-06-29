'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BettingOdds from '@/components/BettingOdds'
import BettingAnalysis from '@/components/BettingAnalysis'

interface BettingMatch {
  id: number
  homeTeam: string
  awayTeam: string
  league: string
  time: string
  status: string
  homeScore?: number
  awayScore?: number
}

export default function BettingPage() {
  const [matches, setMatches] = useState<BettingMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLeague, setSelectedLeague] = useState<string>('all')

  useEffect(() => {
    // 실제로는 API에서 배팅 가능한 경기들을 가져와야 함
    const mockMatches: BettingMatch[] = [
      {
        id: 1,
        homeTeam: '맨체스터 유나이티드',
        awayTeam: '리버풀',
        league: '프리미어 리그',
        time: '오늘 21:00',
        status: '예정',
      },
      {
        id: 2,
        homeTeam: '바르셀로나',
        awayTeam: '레알 마드리드',
        league: '라 리가',
        time: '오늘 23:00',
        status: '예정',
      },
      {
        id: 3,
        homeTeam: '파리 생제르맹',
        awayTeam: '바이에른 뮌헨',
        league: '챔피언스 리그',
        time: '내일 03:00',
        status: '예정',
      },
      {
        id: 4,
        homeTeam: '첼시',
        awayTeam: '아스널',
        league: '프리미어 리그',
        time: '진행중',
        status: 'live',
        homeScore: 1,
        awayScore: 0,
      },
      {
        id: 5,
        homeTeam: '인터 밀란',
        awayTeam: 'AC 밀란',
        league: '세리에 A',
        time: '내일 21:00',
        status: '예정',
      }
    ]

    setTimeout(() => {
      setMatches(mockMatches)
      setLoading(false)
    }, 1000)
  }, [])

  const leagues = ['all', '프리미어 리그', '라 리가', '챔피언스 리그', '세리에 A']
  
  const filteredMatches = selectedLeague === 'all' 
    ? matches 
    : matches.filter(match => match.league === selectedLeague)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">배팅 정보</h1>
          <p className="text-gray-700 text-lg">
            실시간 배당률과 경기 분석을 통해 스마트한 예측을 도와드립니다.
          </p>
        </div>

        {/* 리그 필터 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">리그 선택</h2>
          <div className="flex flex-wrap gap-2">
            {leagues.map((league) => (
              <button
                key={league}
                onClick={() => setSelectedLeague(league)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedLeague === league
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {league === 'all' ? '전체' : league}
              </button>
            ))}
          </div>
        </div>

        {/* 경기 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              {/* 경기 헤더 */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-100 font-medium">{match.league}</span>
                  <span className={`text-sm font-semibold ${
                    match.status === 'live' ? 'text-yellow-300 bg-yellow-900 bg-opacity-30 px-2 py-1 rounded' : 'text-blue-100'
                  }`}>
                    {match.status === 'live' ? 'LIVE' : match.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-white">{match.homeTeam}</span>
                  <div className="text-center">
                    {match.status === 'live' ? (
                      <div className="text-2xl font-bold text-white">
                        {match.homeScore} - {match.awayScore}
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-white">vs</span>
                    )}
                  </div>
                  <span className="font-semibold text-lg text-white">{match.awayTeam}</span>
                </div>
              </div>

              {/* 배팅 정보 */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 배당률 미리보기 */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">주요 배당률</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">{match.homeTeam} 승</span>
                        <span className="font-semibold text-blue-600">2.10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">무승부</span>
                        <span className="font-semibold text-blue-600">3.40</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">{match.awayTeam} 승</span>
                        <span className="font-semibold text-blue-600">3.60</span>
                      </div>
                    </div>
                  </div>

                  {/* 분석 미리보기 */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">예측</h4>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">승리 예측</span>
                        <span className="font-semibold text-green-600">{match.homeTeam}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">신뢰도</span>
                        <span className="font-semibold text-green-600">75%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 상세 보기 버튼 */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/match/${match.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    상세 보기
                  </Link>
                  <Link
                    href={`/chat/${match.id}`}
                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-300"
                  >
                    💬 채팅
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 배팅 팁 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">배팅 팁</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">📊 데이터 분석</h3>
              <p className="text-sm text-blue-700">
                과거 전적과 최근 폼을 종합적으로 분석하여 예측 정확도를 높입니다.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">⚽ 실시간 정보</h3>
              <p className="text-sm text-green-700">
                실시간 경기 상황과 배당률 변화를 모니터링하여 최적의 타이밍을 제공합니다.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2">⚠️ 책임감 있는 게임</h3>
              <p className="text-sm text-yellow-700">
                이 정보는 참고용이며, 과도한 배팅은 피하고 책임감 있는 게임을 즐겨주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 