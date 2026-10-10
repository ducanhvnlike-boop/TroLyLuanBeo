import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Download,
  Code2,
  Check,
  Edit3,
  Eye,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { AgencyInfo, GroundingChunk } from '../types';
import { generateDocxBlob } from '../utils/docxExport';
import { generatePythonDocxScript } from '../utils/pythonDocxGenerator';

interface ReportViewerProps {
  content: string;
  setContent: (val: string) => void;
  agencyInfo: AgencyInfo;
  groundingChunks: GroundingChunk[];
  webSearchQueries: string[];
  usedSearch: boolean;
  quotaNotice?: string;
  onOpenAudit: () => void;
  onOpenSearch: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  content,
  setContent,
  agencyInfo,
  groundingChunks,
  webSearchQueries,
  usedSearch,
  quotaNotice,
  onOpenAudit,
  onOpenSearch,
}) => {
  const [viewMode, setViewMode] = useState<'paper' | 'edit' | 'python'>('paper');
  const [copiedWord, setCopiedWord] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  // Tính số từ và ước tính số trang A4
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  // Một trang A4 chuẩn phông Times New Roman 13-14pt giãn dòng 1.4 khoảng 420 - 480 từ
  const estimatedPages = Math.max(1, Math.round((wordCount / 450) * 10) / 10);

  // Parse lines to render paper preview cleanly
  const lines = content.split('\n');

  let reportTitle = agencyInfo.period ? `BÁO CÁO CÔNG TÁC ${agencyInfo.period.toUpperCase()}` : 'BÁO CÁO KẾT QUẢ CÔNG TÁC BẢO ĐẢM AN NINH TRẬT TỰ';
  let trichYeu = '';

  const bodyLines: string[] = [];
  let reachedBody = false;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) {
      if (reachedBody) bodyLines.push('');
      continue;
    }

    // Skip AI confirmation block in paper view
    if (l.startsWith('---') || l.includes('XÁC NHẬN CÁN BỘ CÔNG AN') || l.includes('BÁO CÁO TIẾP NHẬN:')) {
      continue;
    }

    if (l.startsWith('# ') || (l.toUpperCase().startsWith('BÁO CÁO') && !reachedBody)) {
      reportTitle = l.replace(/^#+\s*/, '').trim();
      reachedBody = true;
      continue;
    }

    if ((l.startsWith('V/v') || l.startsWith('Về việc') || l.startsWith('## V/v') || l.startsWith('## Về việc')) && !reachedBody) {
      trichYeu = l.replace(/^#+\s*/, '').trim();
      continue;
    }

    // Check if line looks like header table that model outputted in text
    if (l.includes('CỘNG HÒA XÃ HỘI') || l.includes('Độc lập - Tự do') || l.includes('Số: ') || l.includes('ngày ... tháng')) {
      continue;
    }

    reachedBody = true;
    bodyLines.push(l);
  }

  // Tải file Word (.docx) trực tiếp
  const handleDownloadDocx = async () => {
    try {
      setDownloadingDocx(true);
      const blob = await generateDocxBlob(content, agencyInfo);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bao_cao_CAP_${agencyInfo.reportNumber.replace(/[^a-zA-Z0-9]/g, '_') || 'ChuyenSau'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Lỗi khi tạo file Word: ${err?.message || 'Không thể xuất file'}`);
    } finally {
      setDownloadingDocx(false);
    }
  };

  // Tải mã Python (.py)
  const handleDownloadPython = () => {
    const script = generatePythonDocxScript(content, agencyInfo);
    const blob = new Blob([script], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tao_bao_cao_chuyen_sau.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy định dạng chuẩn Word (Rich HTML + Plain Text)
  const handleCopyForWord = async () => {
    try {
      const dateStr = `${agencyInfo.location || 'Hà Nội'}, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: "Times New Roman", serif; font-size: 13pt; line-height: 1.4; color: black; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15pt; }
            td { vertical-align: top; padding: 0; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .italic { font-style: italic; }
            .indent { text-indent: 1.27cm; text-align: justify; margin-bottom: 6pt; }
            .title { font-size: 15pt; font-weight: bold; text-align: center; margin-top: 15pt; margin-bottom: 6pt; }
            .subtitle { font-size: 13pt; font-weight: bold; text-align: center; margin-bottom: 15pt; }
            .heading1 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
            .heading2 { font-size: 13pt; font-weight: bold; margin-top: 8pt; margin-bottom: 4pt; }
          </style>
        </head>
        <body>
          <table>
            <tr>
              <td style="width: 45%; text-align: center;">
                <div>${(agencyInfo.superiorOrg || 'CÔNG AN QUẬN').toUpperCase()}</div>
                <div class="bold">${(agencyInfo.issuingAgency || 'CÔNG AN PHƯỜNG').toUpperCase()}</div>
                <div>––––––––––––</div>
                <div>Số: ${agencyInfo.reportNumber || '.../BC-CAP'}</div>
              </td>
              <td style="width: 55%; text-align: center;">
                <div class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div class="bold">Độc lập - Tự do - Hạnh phúc</div>
                <div>––––––––––––––––––––</div>
                <div class="italic">${dateStr}</div>
              </td>
            </tr>
          </table>

          <div class="title">${reportTitle.toUpperCase()}</div>
          ${trichYeu ? `<div class="subtitle">${trichYeu}</div>` : ''}

          ${bodyLines.map(line => {
            const l = line.trim();
            if (!l) return '<br/>';
            if (/^[I|V|X]+\.\s+/i.test(l)) return `<div class="heading1">${l.toUpperCase()}</div>`;
            if (/^\d+\.\s+/i.test(l)) return `<div class="heading2">${l}</div>`;
            if (l.startsWith('- ') || l.startsWith('* ')) return `<div style="margin-left: 20pt; margin-bottom: 4pt;">${l}</div>`;
            return `<p class="indent">${l}</p>`;
          }).join('')}

          <table style="margin-top: 25pt;">
            <tr>
              <td style="width: 50%;">
                <div class="bold italic">Nơi nhận:</div>
                ${(agencyInfo.recipients || 'Công an Quận;\nĐảng ủy, UBND Phường;\nChỉ huy CAP;\nLưu: VT.').split(/;|\n/).map(r => r.trim()).filter(Boolean).map(r => `<div style="font-size: 11pt;">- ${r}</div>`).join('')}
              </td>
              <td style="width: 50%; text-align: center;">
                <div class="bold">${(agencyInfo.signerTitle || 'TRƯỞNG CÔNG AN PHƯỜNG').toUpperCase()}</div>
                <div style="height: 50pt; font-size: 10pt; font-style: italic; margin-top: 35pt;">(Ký, ghi rõ họ tên và đóng dấu)</div>
                <div class="bold">${agencyInfo.signerRank || 'Trung tá'} ${agencyInfo.signerName || 'Nguyễn Văn Hùng'}</div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([content], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText,
        }),
      ]);

      setCopiedWord(true);
      setTimeout(() => setCopiedWord(false), 2500);
    } catch (err) {
      navigator.clipboard.writeText(content);
      setCopiedWord(true);
      setTimeout(() => setCopiedWord(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const pythonScript = generatePythonDocxScript(content, agencyInfo);

  return (
    <div className="bg-slate-100 rounded-xl border border-slate-300 shadow-md overflow-hidden">
      {/* Thông báo nếu kích hoạt dự phòng hạn mức */}
      {quotaNotice && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2.5 text-xs text-amber-950 flex items-center gap-2 no-print">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{quotaNotice}</span>
        </div>
      )}

      {/* Thanh điều khiển trên cùng */}
      <div className="bg-slate-800 text-white p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <div className="bg-red-700 text-white p-1.5 rounded">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Bản Thảo Báo Cáo Chuyên Sâu
              </h3>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-700 rounded text-emerald-100 font-bold flex items-center gap-1">
                <Layers className="w-3 h-3" /> {wordCount.toLocaleString()} từ • ~{estimatedPages} trang A4
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Đạt yêu cầu 3 - 5 trang • Mổ xẻ chi tiết từng số liệu và giải pháp nghiệp vụ
            </p>
          </div>
        </div>

        {/* Chuyển chế độ xem */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-700 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('paper')}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'paper'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Trang Giấy A4 Chuẩn
          </button>
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'edit'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Biên Tập Trực Tiếp
          </button>
          <button
            type="button"
            onClick={() => setViewMode('python')}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'python'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Mã Python (.py)
          </button>
        </div>

        {/* Bộ nút xuất bản & hành động */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenAudit}
            className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Kiểm tra thể thức văn bản hành chính"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
            Kiểm Định Thể Thức
          </button>

          <button
            type="button"
            onClick={handleCopyForWord}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border border-slate-600 shadow-2xs"
            title="Sao chép định dạng giữ nguyên 2 cột sang Microsoft Word"
          >
            {copiedWord ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedWord ? 'Đã Sao Chép Chuẩn Word!' : 'Sao Chép Cho Word'}
          </button>

          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={downloadingDocx}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            title="Tải file Microsoft Word (.docx)"
          >
            <Download className="w-3.5 h-3.5" />
            {downloadingDocx ? 'Đang tạo .docx...' : 'Tải File Word (.docx)'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors border border-slate-600"
            title="In văn bản / Lưu file PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thông tin tra cứu Internet nếu có */}
      {usedSearch && groundingChunks && groundingChunks.length > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-900 flex items-center justify-between flex-wrap gap-2 no-print">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Nguồn tra cứu chính thống Internet:
            </span>
            <span className="text-emerald-800">
              Đã đối chiếu {groundingChunks.length} nguồn tài liệu chính thống phục vụ số liệu báo cáo
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenSearch}
            className="text-[11px] underline text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <Search className="w-3 h-3" /> Tra cứu thêm số liệu chuyên sâu
          </button>
        </div>
      )}

      {/* VÙNG NỘI DUNG HIỂN THỊ CHÍNH */}
      <div className="p-4 sm:p-8 bg-slate-200/70 overflow-x-auto min-h-[600px] flex justify-center">
        {viewMode === 'paper' && (
          <div className="a4-page bg-white shadow-2xl rounded-sm w-full max-w-[850px] min-h-[1100px] p-[20mm_20mm_20mm_30mm] text-slate-900 font-nd30 border border-slate-300">
            {/* 1. KHUNG HEADER 2 CỘT QUẢN LÝ NHÀ NƯỚC */}
            <div className="grid grid-cols-12 gap-2 text-center text-slate-900 mb-6">
              {/* Cột trái: Cơ quan cấp trên & Cơ quan ban hành & Số hiệu */}
              <div className="col-span-5 flex flex-col items-center">
                <p className="text-[13px] leading-tight font-normal uppercase">
                  {agencyInfo.superiorOrg || 'CÔNG AN QUẬN HOÀN KIẾM'}
                </p>
                <p className="text-[13px] leading-tight font-bold uppercase mt-0.5">
                  {agencyInfo.issuingAgency || 'CÔNG AN PHƯỜNG HÀNG TRỐNG'}
                </p>
                {/* Vạch kẻ nét liền dưới tên cơ quan */}
                <div className="w-24 border-b-[1.5px] border-slate-900 my-1"></div>
                <p className="text-[13px] leading-normal font-normal mt-1">
                  Số: {agencyInfo.reportNumber || '.../BC-CAP'}
                </p>
              </div>

              {/* Cột phải: Quốc hiệu & Tiêu ngữ & Địa danh ngày tháng */}
              <div className="col-span-7 flex flex-col items-center">
                <p className="text-[13px] leading-tight font-bold uppercase">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </p>
                <p className="text-[14px] leading-tight font-bold mt-0.5">
                  Độc lập - Tự do - Hạnh phúc
                </p>
                {/* Vạch kẻ nét liền dưới tiêu ngữ */}
                <div className="w-36 border-b-[1.5px] border-slate-900 my-1"></div>
                <p className="text-[13px] leading-normal italic mt-1">
                  {agencyInfo.location || 'Hà Nội'}, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* 2. TIÊU ĐỀ BÁO CÁO (IN HOA, CĂN GIỮA, CỠ 15PT, ĐẬM) */}
            <div className="text-center my-6">
              <h1 className="text-[16px] sm:text-[17px] font-bold uppercase tracking-wide leading-snug">
                {reportTitle}
              </h1>
              {trichYeu && (
                <p className="text-[14px] font-bold mt-1 text-slate-800">
                  {trichYeu}
                </p>
              )}
            </div>

            {/* 3. NỘI DUNG VĂN BẢN (THỤT ĐẦU DÒNG 1.27CM, GIÃN DÒNG 1.4, CĂN ĐỀU) */}
            <div className="text-[14px] leading-[1.5] text-slate-900 space-y-2 text-justify">
              {bodyLines.map((line, idx) => {
                const l = line.trim();
                if (!l) return <div key={idx} className="h-2" />;

                // Đề mục lớn La Mã (I., II., III., IV.)
                if (/^[I|V|X]+\.\s+/i.test(l)) {
                  return (
                    <h2 key={idx} className="font-bold text-[14.5px] uppercase mt-4 mb-1 text-left text-slate-950">
                      {l}
                    </h2>
                  );
                }

                // Đề mục con 1., 2., 3.
                if (/^\d+\.\s+/i.test(l)) {
                  return (
                    <h3 key={idx} className="font-bold text-[14px] mt-2.5 mb-1 text-left text-slate-950">
                      {l}
                    </h3>
                  );
                }

                // Gạch đầu dòng (- hoặc *)
                if (l.startsWith('- ') || l.startsWith('* ')) {
                  return (
                    <p key={idx} className="pl-6 -indent-4 text-justify">
                      {l}
                    </p>
                  );
                }

                // Bảng biểu Markdown (| Cột 1 | Cột 2 |)
                if (l.startsWith('|') && l.endsWith('|')) {
                  const cells = l.split('|').slice(1, -1).map(c => c.trim());
                  if (cells.every(c => /^[-:]+$/.test(c))) {
                    return null;
                  }
                  return (
                    <div key={idx} className="overflow-x-auto my-1">
                      <table className="w-full border-collapse border border-slate-800 text-[13px] my-1">
                        <tbody>
                          <tr>
                            {cells.map((cell, cIdx) => (
                              <td key={cIdx} className="border border-slate-800 p-1.5 text-center font-medium">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                }

                // Đoạn văn thường: thụt đầu dòng 1.27cm
                return (
                  <p key={idx} className="indent-[1.27cm] text-justify leading-relaxed">
                    {l}
                  </p>
                );
              })}
            </div>

            {/* 4. CHỮ KÝ VÀ NƠI NHẬN */}
            <div className="grid grid-cols-12 gap-2 mt-10 pt-4 text-[13px]">
              {/* Cột trái: Nơi nhận */}
              <div className="col-span-6 text-left">
                <p className="font-bold italic text-[12.5px]">Nơi nhận:</p>
                <div className="text-[11.5px] leading-relaxed text-slate-800 mt-0.5 space-y-0.5">
                  {(agencyInfo.recipients || 'Công an Quận (để b/c);\nĐảng ủy, UBND Phường (để b/c);\nChỉ huy CAP;\nLưu: VT, CSKV.')
                    .split(/;|\n/)
                    .map((r, i) => {
                      const item = r.trim();
                      if (!item) return null;
                      return <p key={i}>- {item}</p>;
                    })}
                </div>
              </div>

              {/* Cột phải: Thẩm quyền ký */}
              <div className="col-span-6 text-center flex flex-col items-center">
                <p className="font-bold uppercase text-[14px] leading-snug">
                  {agencyInfo.signerTitle || 'TRƯỞNG CÔNG AN PHƯỜNG'}
                </p>
                <div className="h-20 flex items-center justify-center">
                  <p className="text-[10px] text-slate-400 italic">
                    (Ký, ghi rõ họ tên và đóng dấu)
                  </p>
                </div>
                <p className="font-bold text-[14px]">
                  {agencyInfo.signerRank || 'Trung tá'} {agencyInfo.signerName || 'Nguyễn Văn Hùng'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chế độ biên tập Markdown trực tiếp */}
        {viewMode === 'edit' && (
          <div className="w-full max-w-4xl bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Chỉnh sửa trực tiếp nội dung văn bản:
              </label>
              <span className="text-[11px] text-slate-500">
                {wordCount.toLocaleString()} từ • Các thay đổi sẽ tự động phản ánh vào Trang A4 và file Word tải về
              </span>
            </div>
            <textarea
              rows={28}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-amber-600 flex-1"
            />
          </div>
        )}

        {/* Chế độ mã nguồn Python (python-docx) */}
        {viewMode === 'python' && (
          <div className="w-full max-w-4xl bg-slate-900 text-slate-100 p-5 rounded-lg border border-slate-700 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase">Mã nguồn Python python-docx tự động</span>
                <p className="text-[11px] text-slate-400">
                  Chạy lệnh: <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">python tao_bao_cao_chuyen_sau.py</code> để tự sinh file Word (.docx)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(pythonScript);
                    setCopiedMd(true);
                    setTimeout(() => setCopiedMd(false), 2000);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs text-white flex items-center gap-1"
                >
                  {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedMd ? 'Đã sao chép mã!' : 'Sao chép mã Python'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPython}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded text-xs font-bold text-white flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Tải file .py
                </button>
              </div>
            </div>
            <pre className="p-4 bg-slate-950 rounded border border-slate-800 overflow-x-auto text-[11px] font-mono text-emerald-300 leading-relaxed max-h-[600px] overflow-y-auto">
              <code>{pythonScript}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
