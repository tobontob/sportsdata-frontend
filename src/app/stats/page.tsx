"use client";
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Team {
  id: number;
  name: string;
  logo_url: string;
}

interface TeamStat {
  teamId: number;
  teamName: string;
  avgGoals: number;
  avgConceded: number;
  possession: number;
  passSuccess: number;
}

interface SummaryStats {
  month: string;
  record: string;
  goals: number;
  conceded: number;
  bestPlayer: string;
  bestTeam: string;
}

export default function StatsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [teamStats, setTeamStats] = useState<TeamStat[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => {
        setTeams(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/teams/stats')
      .then(res => res.json())
      .then(data => {
        setTeamStats(Array.isArray(data) ? data : [])
        setStatsLoading(false)
      })
      .catch(() => {
        setStatsError('팀별 통계 정보를 불러올 수 없습니다.')
        setStatsLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch('/api/teams/summary-stats')
      .then(res => res.json())
      .then(data => {
        setSummaryStats(data)
        setSummaryLoading(false)
      })
      .catch(() => {
        setSummaryError('요약 통계 정보를 불러올 수 없습니다.')
        setSummaryLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">통계</h1>
          <p className="text-gray-700 text-lg">
            팀별, 선수별 상세 통계와 분석을 확인하세요.
          </p>
        </div>

        {/* 팀 통계 - DB에서 불러온 팀 목록 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">팀 목록</h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {teams.map((team) => (
                <Link key={team.id} href={`/team/${team.id}`} className="flex flex-col items-center p-3 bg-gray-50 rounded border border-gray-200 hover:bg-blue-50 transition-colors">
                  {team.logo_url && (
                    <img src={team.logo_url} alt={team.name} className="w-10 h-10 mb-2 rounded-full border" />
                  )}
                  <span className="text-sm font-medium text-gray-900 text-center underline hover:text-blue-700">{team.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 득점 순위 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">득점 순위</h2>
            <div className="space-y-3">
              {[
                { rank: 1, player: '해리 케인', team: '바이에른 뮌헨', goals: 18 },
                { rank: 2, player: '에를링 홀란드', team: '맨체스터 시티', goals: 16 },
                { rank: 3, player: '킬리안 음바페', team: '파리 생제르맹', goals: 15 }
              ].map((item) => (
                <div key={item.rank} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{item.rank}. {item.player}</span>
                    <div className="text-xs text-gray-600">{item.team}</div>
                  </div>
                  <span className="font-semibold text-blue-600">{item.goals}골</span>
                </div>
              ))}
            </div>
          </div>

          {/* 도움 순위 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">도움 순위</h2>
            <div className="space-y-3">
              {[
                { rank: 1, player: '케빈 더 브라위너', team: '맨체스터 시티', assists: 12 },
                { rank: 2, player: '브루노 페르난데스', team: '맨체스터 유나이티드', assists: 10 },
                { rank: 3, player: '모하메드 살라', team: '리버풀', assists: 9 }
              ].map((item) => (
                <div key={item.rank} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{item.rank}. {item.player}</span>
                    <div className="text-xs text-gray-600">{item.team}</div>
                  </div>
                  <span className="font-semibold text-green-600">{item.assists}도움</span>
                </div>
              ))}
            </div>
          </div>

          {/* 클린시트 순위 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">클린시트</h2>
            <div className="space-y-3">
              {[
                { rank: 1, player: '알리송', team: '리버풀', cleanSheets: 8 },
                { rank: 2, player: '에데르송', team: '맨체스터 시티', cleanSheets: 7 },
                { rank: 3, player: '데 헤아', team: '맨체스터 유나이티드', cleanSheets: 6 }
              ].map((item) => (
                <div key={item.rank} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{item.rank}. {item.player}</span>
                    <div className="text-xs text-gray-600">{item.team}</div>
                  </div>
                  <span className="font-semibold text-purple-600">{item.cleanSheets}회</span>
                </div>
              ))}
            </div>
          </div>

          {/* 팀 통계 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">팀 통계</h2>
            {statsLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : statsError ? (
              <div className="text-center text-red-500 text-sm py-4">{statsError}</div>
            ) : teamStats.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-4">팀 통계 데이터가 없습니다.</div>
            ) : (
              <div className="space-y-3">
                {teamStats.map((item) => (
                  <div key={item.teamId} className="flex flex-col md:flex-row md:justify-between md:items-center p-2 bg-gray-50 rounded border border-gray-200 mb-2">
                    <Link href={`/team/${item.teamId}`} className="text-sm font-medium text-gray-900 mb-1 md:mb-0 underline hover:text-blue-700">
                      {item.teamName}
                    </Link>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                      <span>평균 득점 <b className="text-blue-700">{item.avgGoals}</b></span>
                      <span>평균 실점 <b className="text-red-700">{item.avgConceded}</b></span>
                      <span>점유율 <b className="text-green-700">{item.possession}%</b></span>
                      <span>패스 성공률 <b className="text-purple-700">{item.passSuccess}%</b></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 상세 통계 차트 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">월별 성과</h2>
          {summaryLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : summaryError ? (
            <div className="text-center text-red-500 text-sm py-4">{summaryError}</div>
          ) : !summaryStats ? (
            <div className="text-center text-gray-500 text-sm py-4">요약 통계 데이터가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">{summaryStats.record}</div>
                <div className="text-sm text-gray-600">{summaryStats.month} 성과</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">{summaryStats.goals}골</div>
                <div className="text-sm text-gray-600">득점</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">{summaryStats.conceded}골</div>
                <div className="text-sm text-gray-600">실점</div>
              </div>
              <div className="text-center md:col-span-3 mt-4">
                <div className="text-base text-gray-800">이달의 선수: <b className="text-blue-700">{summaryStats.bestPlayer}</b> / 이달의 팀: <b className="text-green-700">{summaryStats.bestTeam}</b></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 