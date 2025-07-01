"use client";

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
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [targetDetail, setTargetDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const fetchTargetDetail = async (report: Report) => {
    setSelectedReport(report);
    setDetailLoading(true);
    let detail = null;
    try {
      if (report.target_type === 'post') {
        const res = await fetch(`/api/community/post/${report.target_id}`);
        if (res.ok) detail = await res.json();
      } else if (report.target_type === 'comment') {
        const res = await fetch(`/api/community/comment/${report.target_id}`);
        if (res.ok) detail = await res.json();
      } else if (report.target_type === 'chat') {
        detail = { message: '(메시지 원문 없음)' };
      } else if (report.target_type === 'betting') {
        detail = { info: report.target_id };
      }
    } catch {}
    setTargetDetail(detail);
    setDetailLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 통계 계산
  const total = reports.length;
  const pending = reports.filter(r => !r.status || r.status === 'pending').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const deleted = reports.filter(r => r.status === 'deleted').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">신고 내역 (관리자)</h1>
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">전체 신고: {total}</div>
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">미처리: {pending}</div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">처리완료: {resolved}</div>
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">삭제: {deleted}</div>
        </div>
        {reports.length === 0 ? (
          <div className="text-center text-gray-500">신고 내역이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => fetchTargetDetail(report)}
              >
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
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
              <h3 className="text-lg font-bold mb-4">신고 상세</h3>
              <div className="mb-2 text-sm text-gray-700">
                <div><b>대상 유형:</b> {selectedReport.target_type}</div>
                <div><b>대상 ID:</b> {selectedReport.target_id}</div>
                <div><b>신고자:</b> {selectedReport.user_id}</div>
                <div><b>신고일:</b> {new Date(selectedReport.created_at).toLocaleString()}</div>
                <div><b>사유:</b> {selectedReport.reason}</div>
                <div><b>상태:</b> {selectedReport.status || 'pending'}</div>
              </div>
              <div className="mb-4">
                <b>원본 내용 미리보기:</b>
                {detailLoading ? (
                  <div className="text-gray-400">불러오는 중...</div>
                ) : targetDetail ? (
                  <pre className="bg-gray-100 rounded p-2 mt-1 text-xs whitespace-pre-wrap">{JSON.stringify(targetDetail, null, 2)}</pre>
                ) : (
                  <div className="text-gray-400">원본 정보를 불러올 수 없습니다.</div>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setSelectedReport(null)}
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