'use client'

import { useOdds } from '@/hooks/useOdds'
import type { OddsApiResponse } from '@/types/odds'

interface BettingOddsProps {
  matchId: number
  homeTeam: string
  awayTeam: string
}

export default function BettingOdds({ matchId, homeTeam, awayTeam }: BettingOddsProps) {
  const { odds, loading, error } = useOdds(matchId)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !odds || !odds.response || odds.response.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[180px]">
        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <p className="text-gray-500 text-center mb-2">배당률 정보를 불러올 수 없습니다.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          새로고침
        </button>
        <a
          href="https://www.kcba.or.kr/guide/betting" target="_blank" rel="noopener noreferrer"
          className="mt-2 text-xs text-blue-600 underline hover:text-blue-800"
        >
          배당률 FAQ 보기
        </a>
      </div>
    )
  }

  // 여러 bookmaker 모두 표시
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">배팅 배당률</h3>
      <div className="space-y-8">
        {odds.response[0].bookmakers.map((bookmaker, bIdx) => (
          <div key={bIdx} className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-bold text-blue-700">{bookmaker.bookmaker}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Bookmaker #{bIdx + 1}</span>
            </div>
            <div className="space-y-4">
              {bookmaker.bets.map((bet, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-medium text-gray-800 mb-3">{bet.label}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {bet.values.map((outcome, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {outcome.value}
                        </span>
                        <span className="text-lg text-blue-700 font-semibold">
                          {outcome.odd}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800 font-medium">
          ⚠️ 이 정보는 참고용이며, 실제 배팅과는 다를 수 있습니다. 책임감 있는 게임을 즐겨주세요.
        </p>
      </div>
    </div>
  )
} 