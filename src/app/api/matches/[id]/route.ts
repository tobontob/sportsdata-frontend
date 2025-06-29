import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const matchId = context.params.id
    
    // 백엔드 API에서 특정 경기 상세 정보 가져오기
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/matches/${matchId}`, {
      next: { revalidate: 30 } // 30초마다 재검증
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch match details')
    }
    
    const data = await response.json()
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '경기 상세 정보를 불러오지 못했습니다.' }, 
      { status: 500 }
    )
  }
} 