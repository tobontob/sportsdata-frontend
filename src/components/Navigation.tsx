'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const Navigation = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '홈', icon: '🏠' },
    { href: '/live', label: '실시간', icon: '⚽' },
    { href: '/schedule', label: '일정', icon: '📅' },
    { href: '/leagues', label: '리그', icon: '🏆' },
    { href: '/stats', label: '통계', icon: '📊' },
    { href: '/news', label: '뉴스', icon: '📰' },
    { href: '/chat', label: '채팅', icon: '💬' },
    { href: '/betting', label: '배팅', icon: '🎯' },
  ]
  const boardItems = [
    { href: '/board/football', label: '축구' },
    { href: '/board/baseball', label: '야구' },
    { href: '/board/basketball', label: '농구' },
    { href: '/board/volleyball', label: '배구' },
  ]
  const communityItems = [
    { href: '/community/free', label: '자유' },
    { href: '/community/politics', label: '정치' },
    { href: '/community/economy', label: '경제' },
    { href: '/community/entertain', label: '연예' },
    { href: '/community/humor', label: '유머' },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Sports Data</span>
            </Link>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {item.label}
                </Link>
              ))}
              <div className="relative group">
                <button className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none">게시판 ▾</button>
                <div className="absolute left-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  {boardItems.map(item => (
                    <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{item.label}</Link>
                  ))}
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none">커뮤니티 ▾</button>
                <div className="absolute left-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  {communityItems.map(item => (
                    <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{item.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="ml-2 text-gray-700 hidden md:block">
                    {user.nickname}
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user.nickname}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      프로필
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                로그인
              </Link>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">메뉴 열기</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>{item.label}</Link>
          ))}
          <div className="border-t my-2"></div>
          <div className="font-semibold px-3 py-1 text-gray-700">게시판</div>
          {boardItems.map(item => (
            <Link key={item.href} href={item.href} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>{item.label}</Link>
          ))}
          <div className="font-semibold px-3 py-1 text-gray-700">커뮤니티</div>
          {communityItems.map(item => (
            <Link key={item.href} href={item.href} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>{item.label}</Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation 