"use client";

import { useEffect, useState } from 'react'

interface League {
  id: number;
  name: string;
  logo_url: string;
}

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/leagues`)
      .then(res => res.json())
      .then(data => {
        console.log('leagues data:', data);
        setLeagues(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">리그 목록</h1>
          <p className="text-gray-700 text-lg">
            DB에 저장된 전체 리그를 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <div key={league.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {league.logo_url && (
                  <img src={league.logo_url} alt={league.name} className="w-8 h-8 mr-2 rounded-full border" />
                )}
                <span className="text-lg font-semibold text-gray-900">{league.name}</span>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                상세 보기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 