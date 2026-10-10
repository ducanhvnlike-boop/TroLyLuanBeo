export interface AgencyInfo {
  superiorOrg: string;    // e.g. CÔNG AN THÀNH PHỐ HÀ NỘI / CÔNG AN QUẬN HOÀN KIẾM
  issuingAgency: string;  // e.g. CÔNG AN PHƯỜNG HÀNG TRỐNG
  reportNumber: string;   // e.g. 128/BC-CAP
  location: string;       // e.g. Hà Nội
  period: string;         // e.g. Tháng 10 năm 2026
  signerTitle: string;    // e.g. TRƯỞNG CÔNG AN PHƯỜNG
  signerRank: string;     // e.g. Trung tá
  signerName: string;     // e.g. Nguyễn Văn Hùng
  recipients: string;     // e.g. Công an quận (để b/c); Đảng ủy, UBND phường (để b/c); Chỉ huy CAP; Lưu: VT, CSKV.
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  guidanceDoc: string;
  sampleRawData?: string;
  suggestedTopic: string;
}

export interface FormatAuditItem {
  element: string;
  status: 'pass' | 'warning' | 'error';
  note: string;
}

export interface FormatAuditResult {
  score: number;
  status: 'Đạt chuẩn' | 'Cần hoàn thiện' | 'Chưa đạt';
  summary: string;
  items: FormatAuditItem[];
  suggestions: string[];
}
