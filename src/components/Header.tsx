import React from 'react';
import { Shield, FileText, CheckCircle2, Award, User, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-red-900 via-red-800 to-amber-900 text-white shadow-lg border-b-4 border-amber-500 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Huy hiệu CAND cách điệu trang nghiêm */}
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-red-950 flex items-center justify-center border-2 border-amber-300">
                <Shield className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded text-xs font-semibold tracking-wide uppercase">
                  CÔNG AN NHÂN DÂN VIỆT NAM
                </span>
                <span className="px-2 py-0.5 bg-amber-900/80 text-amber-200 border border-amber-500/40 rounded text-xs font-bold flex items-center gap-1 shadow-2xs">
                  <User className="w-3.5 h-3.5 text-amber-400" /> Tác giả: Quốc Đại
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Trợ Lý Soạn Thảo Báo Cáo Công An Phường
              </h1>
              <p className="text-xs sm:text-sm text-red-100/90 mt-0.5">
                Phân tích dữ liệu chuyên sâu • Đánh giá đa chiều • Báo cáo toàn diện 3 đến 5 trang A4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/25 backdrop-blur rounded-lg border border-white/10 text-xs">
              <Layers className="w-4 h-4 text-amber-400" />
              <div>
                <p className="font-semibold text-white">Độ dài chuẩn: 3 - 5 Trang A4</p>
                <p className="text-[10px] text-amber-200/80">1.500 - 2.500 từ • Mổ xẻ nguyên nhân</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/25 backdrop-blur rounded-lg border border-white/10 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-semibold text-white">Xuất Word (.docx) & Python</p>
                <p className="text-[10px] text-emerald-200/80">Canh lề chuẩn, bảng biểu rõ nét</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
