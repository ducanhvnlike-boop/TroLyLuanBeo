import React from 'react';
import { UserCheck, Globe, Database, FileCheck, Layers } from 'lucide-react';

interface ConfirmationBannerProps {
  guidanceDocName?: string;
  hasRawData: boolean;
  rawDataName?: string;
  usedSearch: boolean;
  officerNote?: string;
}

export const ConfirmationBanner: React.FC<ConfirmationBannerProps> = ({
  guidanceDocName,
  hasRawData,
  rawDataName,
  usedSearch,
  officerNote,
}) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-600 rounded-r-lg p-4 sm:p-5 shadow-sm mb-6 text-slate-800">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow">
          <UserCheck className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <span>Xác nhận tiếp nhận từ Cán bộ Công an Phường</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 bg-amber-200/70 text-amber-900 font-bold rounded flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-800" /> Tiêu chuẩn: 3 - 5 Trang A4 (1.500 - 2.500 từ)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 mt-1 italic">
            "Báo cáo đồng chí Chỉ huy / Đồng chí phụ trách: Tôi đã tiếp nhận đầy đủ yêu cầu, phân loại rõ ràng tài liệu hướng dẫn và dữ liệu thực tế tại cơ sở; sẵn sàng triển khai phân tích chuyên sâu, mổ xẻ nguyên nhân và xây dựng báo cáo toàn diện."
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 text-xs">
            {/* 1. Tài liệu hướng dẫn */}
            <div className="bg-white/80 border border-amber-200 rounded p-2 flex items-start gap-2">
              <FileCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Tài liệu Hướng dẫn / Đề cương:</p>
                <p className="text-slate-600 truncate max-w-[200px]">
                  {guidanceDocName || 'Khung đề cương chuẩn nghiệp vụ Công an'}
                </p>
              </div>
            </div>

            {/* 2. Dữ liệu thô */}
            <div className="bg-white/80 border border-amber-200 rounded p-2 flex items-start gap-2">
              <Database className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Dữ liệu số liệu đầu vào:</p>
                <p className="text-slate-600">
                  {hasRawData
                    ? `Dữ liệu số liệu thực tế (${rawDataName || 'Đã nạp'})`
                    : 'Không có dữ liệu thô từ người dùng'}
                </p>
              </div>
            </div>

            {/* 3. Tra cứu Internet */}
            <div className={`border rounded p-2 flex items-start gap-2 ${
              usedSearch
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                : 'bg-white/80 border-amber-200 text-slate-700'
            }`}>
              <Globe className={`w-4 h-4 shrink-0 mt-0.5 ${usedSearch ? 'text-emerald-700' : 'text-slate-500'}`} />
              <div>
                <p className="font-semibold">Tra cứu Internet (Google Search):</p>
                <p className="text-[11px]">
                  {usedSearch
                    ? 'Đang kích hoạt tra cứu Cổng TTĐT Bộ CA, Chính phủ'
                    : 'Không kích hoạt (ưu tiên dữ liệu cơ sở đã nạp)'}
                </p>
              </div>
            </div>
          </div>

          {officerNote && (
            <div className="mt-2.5 text-xs text-amber-950 bg-amber-100/60 p-2 rounded border border-amber-200/60">
              <span className="font-semibold">Ghi chú nghiệp vụ:</span> {officerNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
