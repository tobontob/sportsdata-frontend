'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { ChartOptions, ChartData } from 'chart.js'

interface Team {
  id: number
  name: string
  shortName: string
  logoUrl: string
  league: string
  country: string
  founded: number
  venue: string
  manager: string
  players: Player[]
  recentMatches: RecentMatch[]
  stats: TeamStats
}

interface Player {
  id: number
  name: string
  position: string
  number: number
  nationality: string
  age: number
  goals?: number
  assists?: number
}

interface RecentMatch {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  date: string
  result: 'W' | 'D' | 'L'
}

interface TeamStats {
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
  position: number
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Line 차트 컴포넌트를 동적으로 import (SSR 비활성화, 타입 any로 우회)
const Line = dynamic<any>(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false })

export default function TeamDetail() {
  const params = useParams()
  const teamId = Number(params.id)
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/teams/${teamId}`)
        if (!response.ok) {
          throw new Error('팀 정보를 불러오지 못했습니다.')
        }
        const data = await response.json()
        setTeam(data)
      } catch (err) {
        console.error('팀 상세 정보 로딩 에러:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    if (teamId) {
      fetchTeamDetails()
    }
  }, [teamId])

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

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">팀을 찾을 수 없습니다</h1>
            <p className="text-gray-600">요청하신 팀 정보가 존재하지 않습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  // 최근 경기 득점/실점 추이 차트 데이터 준비
  const chartLabels = team.recentMatches.map((m) => m.date)
  const chartHomeGoals = team.recentMatches.map((m) => m.homeTeam === team.name ? m.homeScore : m.awayScore)
  const chartAwayGoals = team.recentMatches.map((m) => m.homeTeam === team.name ? m.awayScore : m.homeScore)

  const chartData: ChartData<'line'> = {
    labels: chartLabels,
    datasets: [
      {
        label: '득점',
        data: chartHomeGoals,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.3,
        fill: true
      },
      {
        label: '실점',
        data: chartAwayGoals,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '최근 경기 득점/실점 추이' }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 팀 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">{team.shortName}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
              <p className="text-gray-700 font-medium mb-1">{team.league} • {team.country}</p>
              <p className="text-sm text-gray-500">창단: {team.founded}년 • 홈구장: {team.venue}</p>
              <p className="text-sm text-gray-500">감독: {team.manager}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{team.stats.points}점</div>
              <div className="text-sm text-gray-600">{team.stats.position}위</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 팀 통계 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">시즌 통계</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">경기 수</span>
                  <span className="font-semibold">{team.stats.played}경기</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">승리</span>
                  <span className="font-semibold text-green-600">{team.stats.won}승</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">무승부</span>
                  <span className="font-semibold text-yellow-600">{team.stats.drawn}무</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">패배</span>
                  <span className="font-semibold text-red-600">{team.stats.lost}패</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">득점</span>
                  <span className="font-semibold text-blue-600">{team.stats.goalsFor}골</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">실점</span>
                  <span className="font-semibold text-red-600">{team.stats.goalsAgainst}골</span>
                </div>
              </div>
            </div>
          </div>

          {/* 최근 경기 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 경기</h3>
              <div className="space-y-3">
                {team.recentMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
                      </div>
                      <div className="text-xs text-gray-500">{match.date}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      match.result === 'W' ? 'bg-green-500' : 
                      match.result === 'D' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {match.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 최근 경기 득점/실점 추이 차트 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">득점/실점 추이</h3>
              <Line data={chartData} options={chartOptions} height={220} />
            </div>
          </div>

          {/* 선수 명단 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 선수</h3>
              <div className="space-y-3">
                {team.players.slice(0, 8).map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {player.number}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{player.name}</div>
                        <div className="text-xs text-gray-500">{player.position} • {player.nationality}</div>
                      </div>
                    </div>
                    {(player.goals || player.assists) && (
                      <div className="text-right">
                        {player.goals && <div className="text-xs text-red-600">{player.goals}골</div>}
                        {player.assists && <div className="text-xs text-blue-600">{player.assists}도움</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Link 
                href={`/team/${team.id}/players`}
                className="mt-4 w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                전체 선수 보기
              </Link>
            </div>
          </div>
        </div>

        {/* 전체 선수 명단 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">전체 선수 명단</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['GK', 'DF', 'MF', 'FW'].map((position) => (
              <div key={position} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">{position}</h4>
                <div className="space-y-2">
                  {team.players
                    .filter(player => player.position === position)
                    .map((player) => (
                      <div key={player.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{player.number}. {player.name}</span>
                        <span className="text-gray-500">{player.age}세</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 