export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">경기 일정</h1>
          <p className="text-gray-700 text-lg">
            오늘부터 이번 주까지의 모든 경기 일정을 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 오늘의 경기 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">오늘의 경기</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700 font-medium mb-1">프리미어 리그</div>
                <div className="font-semibold text-gray-900">맨체스터 유나이티드 vs 리버풀</div>
                <div className="text-sm text-gray-600">21:00</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-700 font-medium mb-1">라 리가</div>
                <div className="font-semibold text-gray-900">바르셀로나 vs 레알 마드리드</div>
                <div className="text-sm text-gray-600">23:00</div>
              </div>
            </div>
          </div>

          {/* 내일의 경기 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">내일의 경기</h2>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-700 font-medium mb-1">챔피언스 리그</div>
                <div className="font-semibold text-gray-900">파리 생제르맹 vs 바이에른 뮌헨</div>
                <div className="text-sm text-gray-600">03:00</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-sm text-orange-700 font-medium mb-1">세리에 A</div>
                <div className="font-semibold text-gray-900">인터 밀란 vs AC 밀란</div>
                <div className="text-sm text-gray-600">21:00</div>
              </div>
            </div>
          </div>

          {/* 이번 주 경기 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">이번 주 경기</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-700 font-medium mb-1">분데스리가</div>
                <div className="font-semibold text-gray-900">바이에른 뮌헨 vs 도르트문트</div>
                <div className="text-sm text-gray-600">토요일 22:30</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-700 font-medium mb-1">리그앙</div>
                <div className="font-semibold text-gray-900">파리 생제르맹 vs 마르세유</div>
                <div className="text-sm text-gray-600">일요일 21:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* 월별 캘린더 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">월별 캘린더</h2>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="p-2 font-medium text-gray-700 bg-gray-100 rounded">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i + 1} className="p-2 text-sm text-gray-600 hover:bg-blue-50 rounded cursor-pointer">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 