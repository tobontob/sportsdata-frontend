import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leagueId = params.id
    // 백엔드 API에서 특정 리그 상세 정보 가져오기
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leagues/${leagueId}`, {
      next: { revalidate: 60 }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch league details')
    }
    const data = await response.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '리그 상세 정보를 불러오지 못했습니다.' },
      { status: 500 }
    )
  }
} 