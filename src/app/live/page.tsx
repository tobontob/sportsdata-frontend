import LiveScore from '@/components/LiveScore'

export default function LivePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          실시간 경기
        </h1>
        <p className="text-gray-600">
          현재 진행 중인 모든 경기의 실시간 스코어를 확인하세요
        </p>
      </div>
      
      <LiveScore />
    </div>
  )
} 