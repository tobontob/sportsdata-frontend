'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (error) {
      console.error('로그인 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 팝업 오픈 함수
  const openSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/social/${provider}`;
    window.open(
      url,
      'socialLogin',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  // 소셜 로그인 postMessage 수신 및 로그인 처리
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 보안: 백엔드 도메인만 허용
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/api.*/, ''),
        window.location.origin
      ];
      if (!allowedOrigins.includes(event.origin)) return;
      if (event.data && event.data.token) {
        // JWT 저장 및 로그인 처리
        localStorage.setItem('token', event.data.token);
        // 새로고침 또는 사용자 정보 갱신 등
        window.location.reload();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          로그인
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              사용자명 또는 이메일
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="사용자명 또는 이메일을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              회원가입
            </button>
          </p>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => openSocialLogin('google')}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-50 shadow-sm"
          >
            구글로 로그인
          </button>
          <button
            type="button"
            onClick={() => openSocialLogin('kakao')}
            className="w-full flex items-center justify-center gap-2 bg-yellow-300 border border-yellow-400 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-200 shadow-sm"
          >
            카카오로 로그인
          </button>
          <button
            type="button"
            onClick={() => openSocialLogin('naver')}
            className="w-full flex items-center justify-center gap-2 bg-green-500 border border-green-600 text-white py-2 px-4 rounded-md hover:bg-green-400 shadow-sm"
          >
            네이버로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 