import Image from "next/image";
import LiveScoreSection from '@/components/LiveScoreSection';
import GlobalChatRoom from '@/components/chat/GlobalChatRoom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            실시간 스포츠 스코어보드
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            전 세계 주요 리그의 실시간 경기 결과와 통계를 확인하세요.
            실시간 채팅으로 다른 팬들과 소통하고, 배팅 정보로 더욱 재미있게 경기를 즐겨보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 실시간 경기 */}
          <div className="lg:col-span-2">
            <LiveScoreSection />
          </div>

          {/* 빠른 링크 + 전체 채팅방 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 링크</h2>
              <div className="space-y-3">
                <a href="/schedule" className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  📅 경기 일정
                </a>
                <a href="/leagues" className="block p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  🏆 리그 순위
                </a>
                <a href="/stats" className="block p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  📊 통계
                </a>
                <a href="/news" className="block p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                  📰 뉴스
                </a>
                <a href="/betting" className="block p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                  🎯 배팅 정보
                </a>
              </div>
            </div>

            {/* 전체 채팅방(자유 채팅) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">전체 채팅방</h2>
              <GlobalChatRoom />
            </div>

            {/* 인기 경기 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">인기 경기</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">프리미어 리그</div>
                  <div className="font-medium text-gray-900">맨체스터 유나이티드 vs 리버풀</div>
                  <div className="text-sm text-gray-600">오늘 21:00</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">라 리가</div>
                  <div className="font-medium text-gray-900">바르셀로나 vs 레알 마드리드</div>
                  <div className="text-sm text-gray-600">오늘 23:00</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">챔피언스 리그</div>
                  <div className="font-medium text-gray-900">파리 생제르맹 vs 바이에른 뮌헨</div>
                  <div className="text-sm text-gray-600">내일 03:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
