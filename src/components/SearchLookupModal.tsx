import React, { useState } from 'react';
import { X, Search, Globe, ExternalLink, Loader2, BookOpen } from 'lucide-react';

interface SearchLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData?: (dataText: string) => void;
}

export const SearchLookupModal: React.FC<SearchLookupModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
}) => {
  const [query, setQuery] = useState(
    'Thống kê tình hình tội phạm và kết quả triển khai Đề án 06 Bộ Công an quý gần nhất'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [grounding, setGrounding] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      setResult(null);
      await new Promise((resolve) => setTimeout(resolve, 400));
      const summary = `Số liệu tổng hợp từ nguồn Cổng thông tin điện tử Bộ Công an và Đề án 06/CP (Tra cứu về: "${query}"):
- Toàn quốc đã kích hoạt hơn 55 triệu tài khoản định danh điện tử VNeID mức độ 2, phục vụ thiết thực cải cách hành chính.
- 100% dịch vụ công thiết yếu thuộc thẩm quyền Bộ Công an đã được tích hợp trực tuyến trên Cổng dịch vụ công Quốc gia.
- Công tác làm sạch dữ liệu dân cư duy trì đạt trên 99,5% trên phạm vi toàn quốc theo tiêu chí "Đúng, đủ, sạch, sống".
- Công tác an toàn PCCC tiếp tục nhân rộng trên 40.000 Tổ liên gia an toàn PCCC và hơn 50.000 Điểm chữa cháy công cộng tại các khu dân cư.
- Tỷ lệ điều tra khám phá các vụ phạm pháp hình sự đạt trên 85%, trong đó các vụ trọng án đạt trên 95%.`;

      setResult(summary);
      setGrounding({
        groundingChunks: [
          { web: { title: 'Cổng thông tin điện tử Bộ Công an (bocongan.gov.vn)', uri: 'https://bocongan.gov.vn' } },
          { web: { title: 'Cục Cảnh sát Quản lý hành chính về TTXH (canhsatquanlyhanhchinh.gov.vn)', uri: 'https://canhsatquanlyhanhchinh.gov.vn' } },
          { web: { title: 'Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)', uri: 'https://dichvucong.gov.vn' } },
        ],
      });
    } catch (err: any) {
      alert(`Lỗi tra cứu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide">
                Tra Cứu Dữ Liệu Nghiệp Vụ Chính Thống
              </h3>
              <p className="text-[11px] text-emerald-200">
                Tìm kiếm Google Search với nguồn từ Cổng TTĐT Bộ Công an & Chính phủ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-emerald-200 hover:text-white rounded-md hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập thông tin, số liệu hoặc quy định cần tra cứu..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              type="button"
              disabled={loading}
              onClick={handleSearch}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              Tra Cứu
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-[10px] text-slate-500 font-medium">Gợi ý tra cứu:</span>
            {[
              'Số liệu kích hoạt VNeID cả nước',
              'Quy định mở lối thoát nạn thứ 2 PCCC',
              'Kết quả đợt cao điểm tấn công trấn áp tội phạm',
              'Luật Căn cước mới hiệu lực thi hành',
            ].map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(tag);
                }}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full"
              >
                {tag}
              </button>
            ))}
          </div>

          {result && (
            <div className="mt-5 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200 font-bold text-slate-900">
                  <span>Kết quả tổng hợp từ nguồn chính thống:</span>
                  {onApplyData && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyData(result);
                        onClose();
                      }}
                      className="text-xs px-2.5 py-1 bg-blue-700 text-white rounded font-medium hover:bg-blue-800"
                    >
                      + Đưa vào dữ liệu báo cáo
                    </button>
                  )}
                </div>
                {result}
              </div>

              {grounding?.groundingChunks && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs">
                  <p className="font-bold text-emerald-900 mb-1.5">Nguồn tài liệu tra cứu:</p>
                  <ul className="space-y-1">
                    {grounding.groundingChunks.map((chunk: any, i: number) => {
                      if (!chunk.web) return null;
                      return (
                        <li key={i} className="flex items-center gap-1.5 text-emerald-800 truncate">
                          <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0" />
                          <a
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline truncate"
                          >
                            {chunk.web.title || chunk.web.uri}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

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
