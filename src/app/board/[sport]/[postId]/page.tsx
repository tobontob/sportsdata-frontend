"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

interface Comment {
  id: number;
  user: string;
  content: string;
  created_at: string;
}

export default function BoardDetailPage({ params }: any) {
  const { sport, postId } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl(`/api/board/${sport}/${postId}`))
      .then(res => res.json())
      .then(data => {
        setPost(data.post || null);
        setComments(Array.isArray(data.comments) ? data.comments : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sport, postId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(apiUrl(`/api/board/${sport}/${postId}/comments`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ content: commentInput }),
    });
    if (res.ok) {
      setCommentInput('');
      fetch(apiUrl(`/api/board/${sport}/${postId}`))
        .then(res => res.json())
        .then(data => setComments(Array.isArray(data.comments) ? data.comments : []));
    }
    setCommentLoading(false);
  };

  // 신고 핸들러
  const handleReport = async (targetType: string, targetId: number) => {
    const reason = prompt('신고 사유를 입력하세요');
    if (!reason) return;
    const token = localStorage.getItem('token');
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ target_type: targetType, target_id: targetId, reason }),
    });
    if (res.ok) {
      alert('신고가 접수되었습니다.');
    } else {
      alert('신고 실패');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!post) {
    return <div className="text-center py-12 text-gray-500">게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button className="mb-4 text-blue-600 hover:underline" onClick={() => router.back()}>&larr; 목록으로</button>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <div className="text-sm text-gray-500 mb-4">
            {post.author} · {new Date(post.created_at).toLocaleString()}
            <button
              className="text-red-500 hover:underline ml-2"
              onClick={() => handleReport('post', post.id)}
            >
              신고
            </button>
          </div>
          <div className="text-gray-800 whitespace-pre-line min-h-[100px]">{post.content}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">댓글</h2>
          {comments.length === 0 ? (
            <div className="text-gray-400 text-center py-4">아직 댓글이 없습니다.</div>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-b pb-2">
                  <div className="text-sm text-gray-700 font-medium">
                    {comment.user}
                    <button
                      className="text-red-500 hover:underline ml-2"
                      onClick={() => handleReport('comment', comment.id)}
                    >
                      신고
                    </button>
                  </div>
                  <div className="text-gray-800">{comment.content}</div>
                  <div className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
            <input
              className="flex-1 border border-gray-400 rounded px-2 py-1 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="댓글을 입력하세요"
              disabled={commentLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              disabled={commentLoading}
            >
              {commentLoading ? '작성 중...' : '댓글 작성'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 