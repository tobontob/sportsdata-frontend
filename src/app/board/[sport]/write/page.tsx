"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function BoardWritePage({ params }: any) {
  const { sport } = params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(apiUrl(`/api/board/${sport}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      router.push(`/board/${sport}`);
    } else {
      const data = await res.json();
      setError(data.error || '글쓰기 실패');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button className="mb-4 text-blue-600 hover:underline" onClick={() => router.back()}>&larr; 목록으로</button>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">글쓰기</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                maxLength={100}
                placeholder="제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                maxLength={2000}
                placeholder="내용을 입력하세요"
              />
            </div>
            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '작성 중...' : '글쓰기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 