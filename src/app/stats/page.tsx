export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">통계</h1>
          <p className="text-gray-700 text-lg">
            팀별, 선수별 상세 통계와 분석을 확인하세요.
          </p>
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
            <div className="space-y-3">
              {[
                { stat: '평균 득점', value: '2.1', unit: '골' },
                { stat: '평균 실점', value: '0.8', unit: '골' },
                { stat: '점유율', value: '58.5', unit: '%' },
                { stat: '패스 성공률', value: '87.2', unit: '%' }
              ].map((item) => (
                <div key={item.stat} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-700">{item.stat}</span>
                  <span className="font-semibold text-gray-900">{item.value}{item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 상세 통계 차트 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">월별 성과</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">8승 2무 1패</div>
              <div className="text-sm text-gray-600">11월 성과</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">25골</div>
              <div className="text-sm text-gray-600">득점</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">8골</div>
              <div className="text-sm text-gray-600">실점</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 