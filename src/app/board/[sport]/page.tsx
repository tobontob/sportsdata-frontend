"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  author: string;
  created_at: string;
  comment_count: number;
}

export default function BoardPage({ params }: any) {
  const { sport } = params;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/board/${sport}`)
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sport]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{sport} 게시판</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => router.push(`/board/${sport}/write`)}
          >
            글쓰기
          </button>
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-500 text-lg mb-2">아직 게시글이 없습니다.</div>
            <p className="text-gray-400 text-sm">첫 번째 글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer hover:bg-blue-50"
                onClick={() => router.push(`/board/${sport}/${post.id}`)}
              >
                <div className="font-bold text-lg text-gray-900 mb-1">{post.title}</div>
                <div className="text-sm text-gray-500">
                  {post.author} · {new Date(post.created_at).toLocaleString()} · 댓글 {post.comment_count}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 