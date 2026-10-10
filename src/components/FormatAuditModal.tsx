import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle, AlertTriangle, XCircle, Sparkles, RefreshCw } from 'lucide-react';
import { FormatAuditResult } from '../types';
import { auditReportFormat } from '../utils/formatAuditor';

interface FormatAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportContent: string;
}

export const FormatAuditModal: React.FC<FormatAuditModalProps> = ({
  isOpen,
  onClose,
  reportContent,
}) => {
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<FormatAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    if (!reportContent) return;
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const result = auditReportFormat(reportContent);
      setAuditResult(result);
    } catch (err: any) {
      setError(err?.message || 'Lỗi khi rà soát thể thức');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !auditResult) {
      runAudit();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-300" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide">
                Kiểm Định Thể Thức Văn Bản Hành Chính
              </h3>
              <p className="text-[11px] text-indigo-200">
                Rà soát tự động các tiêu chuẩn văn bản hành chính Công an Nhân dân
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-indigo-200 hover:text-white rounded-md hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-600">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm font-medium">Chuyên gia đang rà soát từng thành phần văn bản...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs mb-4">
              <p className="font-bold">Lỗi kiểm tra:</p>
              <p>{error}</p>
              <button
                type="button"
                onClick={runAudit}
                className="mt-2 text-xs font-semibold underline text-red-900"
              >
                Thử lại
              </button>
            </div>
          )}

          {auditResult && !loading && (
            <div className="space-y-4">
              {/* Điểm tổng quan */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Kết Quả Đánh Giá Tổng Thể
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-2xl font-black ${
                      auditResult.score >= 85 ? 'text-emerald-700' : auditResult.score >= 70 ? 'text-amber-600' : 'text-red-700'
                    }`}>
                      {auditResult.score}/100
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      auditResult.status === 'Đạt chuẩn' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {auditResult.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{auditResult.summary}</p>
                </div>

                <button
                  type="button"
                  onClick={runAudit}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Kiểm tra lại
                </button>
              </div>

              {/* Chi tiết từng thành phần */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">
                  Chi tiết các tiêu chuẩn thể thức văn bản:
                </h4>
                <div className="space-y-2">
                  {auditResult.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-lg flex items-start gap-3 bg-white border-slate-200"
                    >
                      {item.status === 'pass' && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {item.status === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      {item.status === 'error' && (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{item.element}</span>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                            item.status === 'pass' ? 'text-emerald-700 bg-emerald-50' : item.status === 'warning' ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'
                          }`}>
                            {item.status === 'pass' ? 'Đạt' : item.status === 'warning' ? 'Lưu ý' : 'Chưa đạt'}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gợi ý hoàn thiện */}
              {auditResult.suggestions && auditResult.suggestions.length > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Khuyến nghị chỉnh sửa:
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-amber-950">
                    {auditResult.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
