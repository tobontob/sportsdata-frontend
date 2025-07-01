import { useEffect, useState } from 'react';

interface Report {
  id: number;
  target_type: string;
  target_id: number;
  reason: string;
  user_id: number;
  created_at: string;
  status?: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/admin/reports', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setReports(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleProcess = async (reportId: number, action: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/reports/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      setReports(reports.map(r => r.id === reportId ? { ...r, status: action } : r));
      alert('처리 완료');
    } else {
      alert('처리 실패');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">신고 내역 (관리자)</h1>
        {reports.length === 0 ? (
          <div className="text-center text-gray-500">신고 내역이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="mb-2">
                  <span className="font-semibold">{report.target_type}</span> #{report.target_id}
                  <span className="ml-4 text-gray-500">신고자: {report.user_id}</span>
                  <span className="ml-4 text-gray-400">{new Date(report.created_at).toLocaleString()}</span>
                </div>
                <div className="mb-2 text-gray-800">사유: {report.reason}</div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => handleProcess(report.id, 'resolved')}
                    disabled={report.status === 'resolved'}
                  >
                    처리완료
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleProcess(report.id, 'deleted')}
                    disabled={report.status === 'deleted'}
                  >
                    삭제
                  </button>
                  <span className="ml-2 text-sm text-gray-500">{report.status ? `상태: ${report.status}` : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 