"use client";
import { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  nickname: string;
  created_at: string;
  warning_count: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = async (q = '') => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/auth/admin/users${q ? `?q=${encodeURIComponent(q)}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const openDetail = async (userId: number) => {
    setDetailLoading(true);
    setSelectedUser(null);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/auth/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setSelectedUser(data);
    setDetailLoading(false);
  };

  const handleAction = async (userId: number, action: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/auth/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      alert('처리 완료');
      fetchUsers(search);
      setSelectedUser(null);
    } else {
      alert('처리 실패');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">회원 관리 (관리자)</h1>
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            className="flex-1 border border-gray-400 rounded px-2 py-1"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="이름, 이메일, 닉네임 검색"
          />
          <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">검색</button>
        </form>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500">회원이 없습니다.</div>
        ) : (
          <table className="w-full text-sm border bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2">ID</th>
                <th className="py-2 px-2">이름</th>
                <th className="py-2 px-2">이메일</th>
                <th className="py-2 px-2">닉네임</th>
                <th className="py-2 px-2">경고</th>
                <th className="py-2 px-2">가입일</th>
                <th className="py-2 px-2">상세</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="py-1 px-2 text-center">{u.id}</td>
                  <td className="py-1 px-2">{u.username}</td>
                  <td className="py-1 px-2">{u.email}</td>
                  <td className="py-1 px-2">{u.nickname}</td>
                  <td className="py-1 px-2 text-center">{u.warning_count}</td>
                  <td className="py-1 px-2 text-center">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-1 px-2 text-center">
                    <button className="text-blue-600 hover:underline" onClick={() => openDetail(u.id)}>상세</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* 상세 모달 */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
              <h3 className="text-lg font-bold mb-4">회원 상세</h3>
              {detailLoading ? (
                <div className="text-gray-400">불러오는 중...</div>
              ) : (
                <div className="mb-2 text-sm text-gray-700">
                  <div><b>ID:</b> {selectedUser.id}</div>
                  <div><b>이름:</b> {selectedUser.username}</div>
                  <div><b>이메일:</b> {selectedUser.email}</div>
                  <div><b>닉네임:</b> {selectedUser.nickname}</div>
                  <div><b>가입일:</b> {new Date(selectedUser.created_at).toLocaleString()}</div>
                  <div><b>경고 횟수:</b> {selectedUser.warning_count}</div>
                </div>
              )}
              <div className="flex gap-2 justify-end mt-4">
                <button
                  className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                  onClick={() => handleAction(selectedUser.id, 'warn')}
                >
                  경고 +1
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleAction(selectedUser.id, 'block')}
                >
                  차단
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                  onClick={() => handleAction(selectedUser.id, 'unblock')}
                >
                  차단 해제
                </button>
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setSelectedUser(null)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 