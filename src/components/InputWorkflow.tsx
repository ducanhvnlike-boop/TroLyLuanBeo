import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Globe,
  Database,
  Building2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  Info,
  CheckCircle,
  FileCheck2,
  Layers,
} from 'lucide-react';
import { POLICE_REPORT_TEMPLATES } from '../data/templates';
import { AgencyInfo, ReportTemplate } from '../types';
import { parseUploadedFile } from '../utils/fileParser';

interface InputWorkflowProps {
  agencyInfo: AgencyInfo;
  setAgencyInfo: React.Dispatch<React.SetStateAction<AgencyInfo>>;
  guidanceDoc: string;
  setGuidanceDoc: (val: string) => void;
  guidanceDocName: string;
  setGuidanceDocName: (val: string) => void;
  rawData: string;
  setRawData: (val: string) => void;
  rawDataName: string;
  setRawDataName: (val: string) => void;
  forceSearch: boolean;
  setForceSearch: (val: boolean) => void;
  reportTopic: string;
  setReportTopic: (val: string) => void;
  reportType: string;
  setReportType: (val: string) => void;
  customInstructions: string;
  setCustomInstructions: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputWorkflow: React.FC<InputWorkflowProps> = ({
  agencyInfo,
  setAgencyInfo,
  guidanceDoc,
  setGuidanceDoc,
  guidanceDocName,
  setGuidanceDocName,
  rawData,
  setRawData,
  rawDataName,
  setRawDataName,
  forceSearch,
  setForceSearch,
  reportTopic,
  setReportTopic,
  reportType,
  setReportType,
  customInstructions,
  setCustomInstructions,
  onGenerate,
  isLoading,
}) => {
  const [showAgencyConfig, setShowAgencyConfig] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('monthly-security');
  const [uploadGuidanceLoading, setUploadGuidanceLoading] = useState(false);
  const [uploadRawLoading, setUploadRawLoading] = useState(false);

  const handleSelectTemplate = (template: ReportTemplate) => {
    setSelectedTemplateId(template.id);
    setReportTopic(template.suggestedTopic);
    setReportType(template.name);
    setGuidanceDoc(template.guidanceDoc);
    setGuidanceDocName(`Đề cương chuẩn: ${template.name}`);
    if (template.sampleRawData && !rawData) {
      setRawData(template.sampleRawData);
      setRawDataName('Số liệu mẫu cơ sở');
    }
  };

  const handleUploadGuidance = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadGuidanceLoading(true);
      const parsed = await parseUploadedFile(file);
      setGuidanceDoc(parsed.text);
      setGuidanceDocName(file.name);
    } catch (err: any) {
      alert(`Lỗi khi đọc file hướng dẫn: ${err.message || 'Không thể trích xuất văn bản'}`);
    } finally {
      setUploadGuidanceLoading(false);
    }
  };

  const handleUploadRaw = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadRawLoading(true);
      const parsed = await parseUploadedFile(file);
      setRawData(parsed.text);
      setRawDataName(file.name);
    } catch (err: any) {
      alert(`Lỗi khi đọc file dữ liệu: ${err.message || 'Không thể trích xuất'}`);
    } finally {
      setUploadRawLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 no-print">
      {/* Thanh chọn mẫu báo cáo nhanh */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">Bước 1: Lựa chọn nghiệp vụ</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-700" />
              Khung Đề Cương Nghiệp Vụ Công An Phường
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAgencyConfig(!showAgencyConfig)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              {showAgencyConfig ? 'Đóng cấu hình cơ quan' : 'Cấu hình đơn vị ban hành'}
              {showAgencyConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Các tab mẫu nghiệp vụ chuẩn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
          {POLICE_REPORT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tmpl)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedTemplateId === tmpl.id
                  ? 'bg-red-50/80 border-red-500 shadow-sm text-red-950 ring-1 ring-red-400'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {tmpl.category}
                </span>
                {selectedTemplateId === tmpl.id && (
                  <CheckCircle className="w-3.5 h-3.5 text-red-700" />
                )}
              </div>
              <p className="text-xs font-bold mt-1.5 line-clamp-1">{tmpl.name}</p>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{tmpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cấu hình Đơn vị ban hành & Người ký */}
      {showAgencyConfig && (
        <div className="p-4 sm:p-5 bg-amber-50/60 border-b border-amber-200/80">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-amber-800" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Thông tin thể thức quản lý nhà nước (Cơ quan ban hành & Người ký)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Cơ quan cấp trên:</label>
              <input
                type="text"
                value={agencyInfo.superiorOrg}
                onChange={(e) => setAgencyInfo({ ...agencyInfo, superiorOrg: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Đơn vị ban hành:</label>
              <input
                type="text"
                value={agencyInfo.issuingAgency}
                onChange={(e) => setAgencyInfo({ ...agencyInfo, issuingAgency: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Số ký hiệu:</label>
              <input
                type="text"
                value={agencyInfo.reportNumber}
                onChange={(e) => setAgencyInfo({ ...agencyInfo, reportNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Địa danh ban hành:</label>
              <input
                type="text"
                value={agencyInfo.location}
                onChange={(e) => setAgencyInfo({ ...agencyInfo, location: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Chức vụ người ký:</label>
              <input
                type="text"
                value={agencyInfo.signerTitle}
                onChange={(e) => setAgencyInfo({ ...agencyInfo, signerTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Cấp bậc / Quân hàm:</label>
              <input
                type="text"
                value={agencyInfo.signerRank}
                onChange={(e) => setAgencyInfo({ ...agencyInfo, signerRank: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Họ và tên người ký:</label>
              <input
                type="text"
                value={agencyInfo.signerName}
                onChange={(e) => setAgencyInfo({ ...agencyInfo, signerName: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Thời gian / Kỳ báo cáo:</label>
              <input
                type="text"
                value={agencyInfo.period}
                onChange={(e) => setAgencyInfo({ ...agencyInfo, period: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block font-medium text-slate-700 mb-1">Nơi nhận văn bản (ngăn cách bằng dấu chấm phẩy ;):</label>
              <input
                type="text"
                value={agencyInfo.recipients}
                onChange={(e) => setAgencyInfo({ ...agencyInfo, recipients: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tiêu đề báo cáo cụ thể */}
      <div className="p-4 sm:p-5 border-b border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Tiêu đề báo cáo hành chính (IN HOA, CĂN GIỮA):
        </label>
        <input
          type="text"
          value={reportTopic}
          onChange={(e) => setReportTopic(e.target.value)}
          placeholder="Ví dụ: BÁO CÁO KẾT QUẢ CÔNG TÁC BẢO ĐẢM AN NINH TRẬT TỰ THÁNG 10 NĂM 2026"
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg font-bold text-sm sm:text-base text-red-950 focus:outline-none focus:ring-2 focus:ring-red-700 uppercase"
        />
      </div>

      {/* 2 Khung tài liệu song song */}
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* KHUNG 1: TÀI LIỆU HƯỚNG DẪN / ĐỀ CƯƠNG */}
        <div className="flex flex-col border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-900 text-white text-[10px] font-bold flex items-center justify-center">1</span>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Tài liệu Hướng dẫn / Đề cương
              </label>
            </div>
            {guidanceDocName && (
              <span className="text-[11px] px-2 py-0.5 bg-red-100 text-red-900 rounded font-medium truncate max-w-[180px]">
                {guidanceDocName}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-600 mb-2">
            Đề cương, kế hoạch, chỉ thị hoặc hướng dẫn kết cấu báo cáo (Word/PDF/Excel hoặc gõ trực tiếp).
          </p>

          <textarea
            rows={8}
            value={guidanceDoc}
            onChange={(e) => {
              setGuidanceDoc(e.target.value);
              if (!guidanceDocName) setGuidanceDocName('Đề cương tự nhập');
            }}
            placeholder="Dán hoặc nhập nội dung đề cương hướng dẫn tại đây..."
            className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono bg-white focus:outline-none focus:ring-2 focus:ring-red-700 resize-none flex-1"
          />

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-medium text-slate-700 cursor-pointer shadow-2xs transition-colors">
              <Upload className="w-3.5 h-3.5 text-red-700" />
              {uploadGuidanceLoading ? 'Đang đọc...' : 'Tải tệp đề cương (Word/PDF/Excel)'}
              <input
                type="file"
                accept=".docx,.xlsx,.xls,.csv,.txt,.pdf"
                onChange={handleUploadGuidance}
                className="hidden"
              />
            </label>

            {guidanceDoc && (
              <button
                type="button"
                onClick={() => {
                  setGuidanceDoc('');
                  setGuidanceDocName('');
                }}
                className="text-xs text-slate-500 hover:text-red-700"
              >
                Xóa nội dung
              </button>
            )}
          </div>
        </div>

        {/* KHUNG 2: DỮ LIỆU SỐ LIỆU ĐẦU VÀO */}
        <div className="flex flex-col border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900 text-white text-[10px] font-bold flex items-center justify-center">2</span>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Dữ liệu số liệu đầu vào (Data Processing)
              </label>
            </div>
            {rawDataName && (
              <span className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-medium truncate max-w-[180px]">
                {rawDataName}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-600 mb-2">
            Số liệu cơ sở (vụ việc, CCCD, VNeID, biên bản, PCCC). Nếu để trống, hệ thống tự động kích hoạt tra cứu Google Search.
          </p>

          <textarea
            rows={8}
            value={rawData}
            onChange={(e) => {
              setRawData(e.target.value);
              if (!rawDataName) setRawDataName('Số liệu tự nhập');
            }}
            placeholder="Dán số liệu thống kê cơ sở tại đây, hoặc tải tệp Excel/Word chứa số liệu... (Hoặc để trống để kích hoạt tra cứu số liệu chính thống)"
            className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none flex-1"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-medium text-slate-700 cursor-pointer shadow-2xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-blue-700" />
                {uploadRawLoading ? 'Đang đọc...' : 'Tải tệp số liệu (Excel/Word/CSV)'}
                <input
                  type="file"
                  accept=".docx,.xlsx,.xls,.csv,.txt,.pdf"
                  onChange={handleUploadRaw}
                  className="hidden"
                />
              </label>

              {rawData && (
                <button
                  type="button"
                  onClick={() => {
                    setRawData('');
                    setRawDataName('');
                  }}
                  className="text-xs text-slate-500 hover:text-red-700"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Toggle tra cứu Google Search */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={forceSearch || !rawData}
                disabled={!rawData}
                onChange={(e) => setForceSearch(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1 text-emerald-800">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                {!rawData ? 'Tự động kích hoạt Google Search' : 'Tra cứu bổ sung Internet'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Yêu cầu và chỉ đạo bổ sung */}
      <div className="px-4 sm:px-5 pb-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          Chỉ đạo / Yêu cầu bổ sung của người chỉ huy:
        </label>
        <input
          type="text"
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="Ví dụ: Nhấn mạnh phân tích địa bàn giáp ranh, nguyên nhân trộm cắp xe máy, đối sách tuần tra vũ trang ban đêm..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-700"
        />

        {/* Nút Thực thi */}
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Tiêu chuẩn bắt buộc: <strong>3 đến 5 trang A4</strong> (~1.500 - 2.500 từ) • Mổ xẻ sâu nguyên nhân & đối sách</span>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={onGenerate}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang phân tích chuyên sâu & xây dựng báo cáo (3-5 trang)...</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-5 h-5 text-amber-300" />
                <span>Soạn Thảo Báo Cáo Chuyên Sâu (3 - 5 Trang A4)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
