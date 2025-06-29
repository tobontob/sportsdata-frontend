'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface League {
  id: number
  name: string
  country: string
  logoUrl: string
  season: string
  teams: Team[]
  standings: Standing[]
  recentMatches: RecentMatch[]
  stats: LeagueStats
}

interface Team {
  id: number
  name: string
  shortName: string
  logoUrl: string
}

interface Standing {
  position: number
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
  form: string[]
}

interface RecentMatch {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  date: string
  status: string
}

interface LeagueStats {
  totalTeams: number
  totalMatches: number
  totalGoals: number
  avgGoalsPerMatch: number
  topScorer: {
    name: string
    team: string
    goals: number
  }
  topAssister: {
    name: string
    team: string
    assists: number
  }
}

export default function LeagueDetail() {
  const params = useParams()
  const leagueId = Number(params.id)
  const [league, setLeague] = useState<League | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeagueDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/leagues/${leagueId}`)
        if (!response.ok) {
          throw new Error('리그 정보를 불러오지 못했습니다.')
        }
        const data = await response.json()
        setLeague(data)
      } catch (err) {
        console.error('리그 상세 정보 로딩 에러:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    if (leagueId) {
      fetchLeagueDetails()
    }
  }, [leagueId])

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

  if (!league) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">리그를 찾을 수 없습니다</h1>
            <p className="text-gray-600">요청하신 리그 정보가 존재하지 않습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 리그 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">{league.name.slice(0, 2)}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{league.name}</h1>
              <p className="text-gray-700 font-medium mb-1">{league.country} • {league.season}</p>
              <p className="text-sm text-gray-500">총 {league.stats.totalTeams}개 팀 • {league.stats.totalMatches}경기</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{league.stats.totalGoals}골</div>
              <div className="text-sm text-gray-600">경기당 {league.stats.avgGoalsPerMatch}골</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 리그 통계 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">리그 통계</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">득점왕</h4>
                  <div className="text-sm">
                    <div className="font-semibold text-blue-900">{league.stats.topScorer.name}</div>
                    <div className="text-blue-700">{league.stats.topScorer.team}</div>
                    <div className="text-blue-600 font-bold">{league.stats.topScorer.goals}골</div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">도움왕</h4>
                  <div className="text-sm">
                    <div className="font-semibold text-green-900">{league.stats.topAssister.name}</div>
                    <div className="text-green-700">{league.stats.topAssister.team}</div>
                    <div className="text-green-600 font-bold">{league.stats.topAssister.assists}도움</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 최근 경기 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 경기</h3>
              <div className="space-y-3">
                {league.recentMatches.map((match) => (
                  <div key={match.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{match.date}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{match.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href={`/league/${league.id}/matches`}
                className="mt-4 w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                전체 경기 보기
              </Link>
            </div>
          </div>

          {/* 참가팀 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">참가팀</h3>
              <div className="space-y-3">
                {league.teams.slice(0, 8).map((team) => (
                  <Link 
                    key={team.id} 
                    href={`/team/${team.id}`}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {team.shortName}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{team.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link 
                href={`/league/${league.id}/teams`}
                className="mt-4 w-full bg-gray-600 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                전체 팀 보기
              </Link>
            </div>
          </div>
        </div>

        {/* 리그 순위 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">리그 순위</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">순위</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">팀</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">경기</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">승</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">무</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">패</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">득점</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">실점</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">승점</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">최근</th>
                </tr>
              </thead>
              <tbody>
                {league.standings.map((standing) => (
                  <tr key={standing.team.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{standing.position}</td>
                    <td className="py-3 px-4">
                      <Link 
                        href={`/team/${standing.team.id}`}
                        className="flex items-center space-x-3 hover:text-blue-600"
                      >
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                          {standing.team.shortName}
                        </div>
                        <span className="font-medium">{standing.team.name}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center">{standing.played}</td>
                    <td className="py-3 px-4 text-center text-green-600 font-medium">{standing.won}</td>
                    <td className="py-3 px-4 text-center text-yellow-600 font-medium">{standing.drawn}</td>
                    <td className="py-3 px-4 text-center text-red-600 font-medium">{standing.lost}</td>
                    <td className="py-3 px-4 text-center font-medium">{standing.goalsFor}</td>
                    <td className="py-3 px-4 text-center font-medium">{standing.goalsAgainst}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">{standing.points}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex space-x-1">
                        {standing.form.map((result, index) => (
                          <div
                            key={index}
                            className={`w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold ${
                              result === 'W' ? 'bg-green-500' : 
                              result === 'D' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          >
                            {result}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 