"use client";

import { useEffect, useState } from 'react';

interface Match {
  id: number;
  match_date: string;
  status: string;
  home_score: number;
  away_score: number;
  minute: number;
  venue: string;
  home_team: string;
  home_team_logo: string;
  away_team: string;
  away_team_logo: string;
  league: string;
  league_logo: string;
}

export default function SchedulePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/matches?status=scheduled')
      .then(res => res.json())
      .then(data => {
        setMatches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">경기 일정</h1>
          <p className="text-gray-700 text-lg">
            예정된 모든 경기 일정을 확인하세요.
          </p>
        </div>
        {matches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-500 text-lg mb-2">예정된 경기가 없습니다.</div>
            <p className="text-gray-400 text-sm">새로운 일정이 등록될 예정입니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
              <div key={match.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">{match.league}</span>
                  <span className="text-xs text-gray-500">{new Date(match.match_date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex-1 text-right">
                    <span className="font-semibold text-lg text-gray-900">{match.home_team}</span>
                  </div>
                  <div className="mx-6 text-center">
                    <img src={match.home_team_logo} alt={match.home_team} width={24} className="inline mr-2" />
                    <span className="text-gray-500">vs</span>
                    <img src={match.away_team_logo} alt={match.away_team} width={24} className="inline ml-2" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-lg text-gray-900">{match.away_team}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">경기장: {match.venue}</div>
                <div className="flex flex-row justify-center gap-2 mt-4">
                  <a
                    href={`/match/${match.id}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    상세
                  </a>
                  <a
                    href={`/betting?matchId=${match.id}`}
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    배팅
                  </a>
                  <a
                    href={`/chat/${match.id}`}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    채팅
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 