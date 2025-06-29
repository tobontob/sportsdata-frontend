export default function LeaguesPage() {
  const leagues = [
    { name: '프리미어 리그', country: '잉글랜드', teams: 20, color: 'blue' },
    { name: '라 리가', country: '스페인', teams: 20, color: 'green' },
    { name: '분데스리가', country: '독일', teams: 18, color: 'purple' },
    { name: '세리에 A', country: '이탈리아', teams: 20, color: 'orange' },
    { name: '리그앙', country: '프랑스', teams: 20, color: 'red' },
    { name: '챔피언스 리그', country: '유럽', teams: 32, color: 'indigo' }
  ]

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      red: 'bg-red-50 border-red-200 text-red-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    }
    return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">리그 순위</h1>
          <p className="text-gray-700 text-lg">
            주요 리그의 순위와 통계를 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <div key={league.name} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getColorClasses(league.color)}`}>
                {league.name}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{league.name}</h3>
              <p className="text-gray-600 mb-4">{league.country}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">참가팀</span>
                <span className="font-semibold text-gray-900">{league.teams}팀</span>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                순위 보기
              </button>
            </div>
          ))}
        </div>

        {/* 인기 팀 순위 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">프리미어 리그 순위</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">순위</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">팀</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-700">경기</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-700">승점</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, team: '맨체스터 시티', played: 20, points: 45 },
                  { rank: 2, team: '아스널', played: 20, points: 43 },
                  { rank: 3, team: '리버풀', played: 20, points: 42 },
                  { rank: 4, team: '첼시', played: 20, points: 38 },
                  { rank: 5, team: '맨체스터 유나이티드', played: 20, points: 35 }
                ].map((row) => (
                  <tr key={row.rank} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium text-gray-900">{row.rank}</td>
                    <td className="p-3 text-sm text-gray-900">{row.team}</td>
                    <td className="p-3 text-sm text-center text-gray-700">{row.played}</td>
                    <td className="p-3 text-sm text-center font-semibold text-gray-900">{row.points}</td>
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