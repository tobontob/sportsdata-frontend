'use client'

import { useState, useEffect } from 'react'
import type { BettingAnalysis } from '@/types/betting'

interface BettingAnalysisProps {
  matchId: number
  homeTeam: string
  awayTeam: string
}

export default function BettingAnalysis({ matchId, homeTeam, awayTeam }: BettingAnalysisProps) {
  const [analysis, setAnalysis] = useState<BettingAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제로는 API에서 분석 데이터를 가져와야 함
    const mockAnalysis: BettingAnalysis = {
      matchId,
      homeForm: 'WWDLL', // W=승리, D=무승부, L=패배
      awayForm: 'LWDWW',
      headToHead: `${homeTeam} 2승 1무승부 2패 ${awayTeam}`,
      prediction: `${homeTeam} 승리`,
      confidence: 75
    }

    setTimeout(() => {
      setAnalysis(mockAnalysis)
      setLoading(false)
    }, 800)
  }, [matchId, homeTeam, awayTeam])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">분석 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500'
      case 'D': return 'bg-yellow-500'
      case 'L': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">경기 분석</h3>

      <div className="space-y-4">
        {/* 팀 폼 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">{homeTeam} 최근 폼</h4>
            <div className="flex gap-1">
              {analysis.homeForm.split('').map((result, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full ${getFormColor(result)} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">{awayTeam} 최근 폼</h4>
            <div className="flex gap-1">
              {analysis.awayForm.split('').map((result, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full ${getFormColor(result)} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 상대 전적 */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-800 mb-2">상대 전적</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{analysis.headToHead}</p>
        </div>

        {/* 예측 */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-800 mb-2">예측</h4>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-lg font-semibold text-gray-900">
              {analysis.prediction}
            </span>
            <div className="text-right">
              <span className={`text-lg font-bold ${getConfidenceColor(analysis.confidence)}`}>
                {analysis.confidence}%
              </span>
              <p className="text-xs text-gray-500">신뢰도</p>
            </div>
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-800 mb-2">주요 통계</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-gray-600 font-medium">평균 득점</p>
              <p className="font-semibold text-gray-900">홈 1.8 - 1.2 원정</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-gray-600 font-medium">평균 실점</p>
              <p className="font-semibold text-gray-900">홈 1.1 - 1.5 원정</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 font-medium">
          📊 이 분석은 과거 데이터를 기반으로 하며, 실제 결과와 다를 수 있습니다.
        </p>
      </div>
    </div>
  )
} 