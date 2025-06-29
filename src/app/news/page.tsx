export default function NewsPage() {
  const news = [
    {
      id: 1,
      title: '맨체스터 유나이티드, 리버풀과의 더비 승리',
      summary: '올드 트래포드에서 열린 맨체스터 더비에서 홈팀이 2-1 승리를 거두었다.',
      category: '경기 결과',
      time: '2시간 전',
      image: '⚽'
    },
    {
      id: 2,
      title: '해리 케인, 바이에른 뮌헨 이적 후 첫 해트트릭',
      summary: '독일 분데스리가에서 해리 케인이 이적 후 첫 해트트릭을 기록했다.',
      category: '선수 소식',
      time: '4시간 전',
      image: '🏆'
    },
    {
      id: 3,
      title: '챔피언스 리그 16강 대진 확정',
      summary: '유럽 챔피언스 리그 16강 대진이 확정되어 팬들의 관심이 집중되고 있다.',
      category: '대회 소식',
      time: '6시간 전',
      image: '🌟'
    },
    {
      id: 4,
      title: '월드컵 예선, 한국 대표팀 명단 발표',
      summary: '2026 월드컵 아시아 예선을 앞두고 한국 대표팀 최종 명단이 발표되었다.',
      category: '국가대표',
      time: '8시간 전',
      image: '🇰🇷'
    }
  ]

  const categories = ['전체', '경기 결과', '선수 소식', '대회 소식', '국가대표']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">뉴스</h1>
          <p className="text-gray-700 text-lg">
            최신 축구 뉴스와 소식을 확인하세요.
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors border border-blue-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 뉴스 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{item.image}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.time}</span>
                </div>
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {item.summary}
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  자세히 보기 →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 인기 뉴스 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">인기 뉴스</h2>
          <div className="space-y-4">
            {[
              { title: '메시, 인터 마이애미에서의 활약', views: '12.5K' },
              { title: '손흥민, 프리미어 리그 득점왕 경쟁', views: '8.9K' },
              { title: '2024년 유럽축구 시장 동향', views: '6.7K' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-900">{item.title}</span>
                <span className="text-xs text-gray-500">{item.views} 조회</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 