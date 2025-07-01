import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function CommunityDetailPage({ params }: { params: { type: string; postId: string } }) {
  const { type, postId } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const router = useRouter();

  // 신고 사유 목록
  const REPORT_REASONS = [
    '스팸/홍보',
    '욕설/비방',
    '음란물/불쾌한 내용',
    '도배/중복',
    '기타'
  ];

  // 신고 다이얼로그 상태
  const [reportTarget, setReportTarget] = useState<{type: string, id: number} | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/community/${type}/${postId}`)
      .then(res => res.json())
      .then(data => {
        setPost(data.post || null);
        setComments(Array.isArray(data.comments) ? data.comments : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type, postId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    // 실제로는 인증/토큰 필요
    const res = await fetch(`/api/community/${type}/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: commentInput }),
    });
    if (res.ok) {
      setCommentInput('');
      // 새 댓글 목록 다시 불러오기
      fetch(`/api/community/${type}/${postId}`)
        .then(res => res.json())
        .then(data => setComments(Array.isArray(data.comments) ? data.comments : []));
    }
    setCommentLoading(false);
  };

  // 신고 핸들러(버튼 클릭)
  const openReportDialog = (targetType: string, targetId: number) => {
    setReportTarget({ type: targetType, id: targetId });
    setSelectedReason('');
  };

  // 실제 신고 전송
  const submitReport = async () => {
    if (!reportTarget || !selectedReason) return;
    setReporting(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ target_type: reportTarget.type, target_id: reportTarget.id, reason: selectedReason }),
    });
    setReporting(false);
    setReportTarget(null);
    if (res.ok) {
      alert('신고가 접수되었습니다.');
    } else if (res.status === 409) {
      alert('이미 신고하셨습니다.');
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
              onClick={() => openReportDialog('post', post.id)}
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
                      onClick={() => openReportDialog('comment', comment.id)}
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
        {/* 신고 다이얼로그 */}
        {reportTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <h3 className="text-lg font-bold mb-4">신고 사유 선택</h3>
              <select
                className="w-full border border-gray-400 rounded px-2 py-1 mb-4"
                value={selectedReason}
                onChange={e => setSelectedReason(e.target.value)}
              >
                <option value="">-- 사유를 선택하세요 --</option>
                {REPORT_REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setReportTarget(null)}
                  disabled={reporting}
                >
                  취소
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  onClick={submitReport}
                  disabled={!selectedReason || reporting}
                >
                  {reporting ? '신고 중...' : '신고하기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 