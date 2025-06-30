"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  time: string;
  league: string;
  date: string;
  minute?: number;
}

const TABS = [
  { key: "live", label: "실시간 경기" },
  { key: "scheduled", label: "예정 경기" },
  { key: "finished", label: "종료 경기" },
];

export default function MatchesPage() {
  const [tab, setTab] = useState("live");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "/api/matches";
        if (tab === "live") url += "/live";
        else if (tab === "scheduled") url += "/scheduled";
        else if (tab === "finished") url += "/finished";
        const res = await fetch(url);
        if (!res.ok) throw new Error("경기 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">경기 일정 및 결과</h1>
        <div className="flex gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg font-semibold border transition-colors ${tab === t.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-500">경기 정보가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Link
                key={match.id}
                href={`/match/${match.id}`}
                className="block bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">{match.league}</span>
                  <span className="text-xs text-gray-500">{match.date} {match.time}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">{match.homeTeam}</span>
                  <span className="text-xl font-bold text-gray-900">{match.homeScore} - {match.awayScore}</span>
                  <span className="font-semibold text-gray-900">{match.awayTeam}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${match.status === "live" ? "bg-red-500 text-white" : match.status === "scheduled" ? "bg-gray-200 text-gray-700" : "bg-green-500 text-white"}`}>{match.status === "live" ? "LIVE" : match.status === "scheduled" ? "예정" : "종료"}</span>
                  {match.minute !== undefined && match.status === "live" && (
                    <span className="text-xs text-blue-600 font-semibold">{match.minute}'</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 