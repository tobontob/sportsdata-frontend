import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/matches`, {
      next: { revalidate: 60 } // 60초마다 재검증
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch matches')
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
      { error: '경기 정보를 불러오지 못했습니다.' }, 
      { status: 500 }
    )
  }
} 