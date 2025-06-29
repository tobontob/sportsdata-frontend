'use client'
import dynamic from 'next/dynamic'

const LiveScore = dynamic(() => import('@/components/LiveScore'), { ssr: false })

export default function LiveScoreSection() {
  return <LiveScore />
} 