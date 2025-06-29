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
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">배당률 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  // 여러 bookmaker 중 첫 번째만 표시 (UI 개선 가능)
  const bookmaker = odds.response[0].bookmakers[0]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">배팅 배당률</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          제공: {bookmaker.bookmaker}
        </span>
      </div>

      <div className="space-y-4">
        {bookmaker.bets.map((bet, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-3">{bet.label}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {bet.values.map((outcome, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
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

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800 font-medium">
          ⚠️ 이 정보는 참고용이며, 실제 배팅과는 다를 수 있습니다. 책임감 있는 게임을 즐겨주세요.
        </p>
      </div>
    </div>
  )
} 