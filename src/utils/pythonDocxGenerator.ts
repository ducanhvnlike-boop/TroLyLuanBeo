import { AgencyInfo } from '../types';

/**
 * Sinh mã nguồn Python hoàn chỉnh sử dụng thư viện python-docx
 * để tạo tài liệu báo cáo hành chính chuẩn thể thức Công an Nhân dân
 */
export function generatePythonDocxScript(
  markdownContent: string,
  agencyInfo: AgencyInfo
): string {
  const superior = (agencyInfo.superiorOrg || 'CÔNG AN QUẬN HOÀN KIẾM').toUpperCase();
  const agency = (agencyInfo.issuingAgency || 'CÔNG AN PHƯỜNG HÀNG TRỐNG').toUpperCase();
  const reportNum = agencyInfo.reportNumber || '128/BC-CAP';
  const location = agencyInfo.location || 'Hà Nội';
  const signerTitle = (agencyInfo.signerTitle || 'TRƯỞNG CÔNG AN PHƯỜNG').toUpperCase();
  const signerName = `${agencyInfo.signerRank || 'Trung tá'} ${agencyInfo.signerName || 'Nguyễn Văn Hùng'}`;

  // Escape content for python multi-line string
  const cleanBodyText = markdownContent
    .replace(/\\/g, '\\\\')
    .replace(/"""/g, '\\"\\"\\"');

  return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HỆ THỐNG TỰ ĐỘNG TẠO BÁO CÁO CÔNG AN PHƯỜNG CHUYÊN SÂU
Tác giả: Quốc Đại
Sử dụng thư viện python-docx
Cài đặt: pip install python-docx
"""

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from datetime import datetime

def set_cell_margins(cell, top=50, bottom=50, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_police_report():
    doc = Document()
    
    # 1. Cấu hình lề trang theo Nghị định 30/2020/NĐ-CP
    # Lề trên: 20mm, Lề dưới: 20mm, Lề trái: 30mm, Lề phải: 20mm
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.79)     # 20 mm
        section.bottom_margin = Inches(0.79)  # 20 mm
        section.left_margin = Inches(1.18)    # 30 mm (lề đóng gáy)
        section.right_margin = Inches(0.79)   # 20 mm

    # Phông mặc định: Times New Roman
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(13)
    font.color.rgb = RGBColor(0, 0, 0)

    # 2. BẢNG TIÊU ĐỀ ĐẦU VĂN BẢN (2 Cột không viền)
    header_table = doc.add_table(rows=1, cols=2)
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    header_table.autofit = False

    # Ẩn đường viền bảng
    for row in header_table.rows:
        for cell in row.cells:
            tcPr = cell._tc.get_or_add_tcPr()
            tcBorders = parse_xml(r'<w:tcBorders %s><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>' % nsdecls('w'))
            tcPr.append(tcBorders)

    # Cột 1: Cơ quan ban hành & Số hiệu
    col1 = header_table.cell(0, 0)
    col1.width = Inches(2.8)
    p1 = col1.paragraphs[0]
    p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p1.paragraph_format.space_after = Pt(2)
    r1 = p1.add_run("""${superior}""")
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(12)

    p2 = col1.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.space_after = Pt(2)
    r2 = p2.add_run("""${agency}""")
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(12)
    r2.bold = True

    p_line1 = col1.add_paragraph()
    p_line1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_line1.paragraph_format.space_after = Pt(4)
    r_l1 = p_line1.add_run("––––––––––––")
    r_l1.font.size = Pt(8)

    p3 = col1.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p3.paragraph_format.space_after = Pt(12)
    r3 = p3.add_run("Số: ${reportNum}")
    r3.font.name = 'Times New Roman'
    r3.font.size = Pt(12)

    # Cột 2: Quốc hiệu & Tiêu ngữ & Địa danh
    col2 = header_table.cell(0, 1)
    col2.width = Inches(3.7)
    p4 = col2.paragraphs[0]
    p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p4.paragraph_format.space_after = Pt(2)
    r4 = p4.add_run("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM")
    r4.font.name = 'Times New Roman'
    r4.font.size = Pt(12)
    r4.bold = True

    p5 = col2.add_paragraph()
    p5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p5.paragraph_format.space_after = Pt(2)
    r5 = p5.add_run("Độc lập - Tự do - Hạnh phúc")
    r5.font.name = 'Times New Roman'
    r5.font.size = Pt(13)
    r5.bold = True

    p_line2 = col2.add_paragraph()
    p_line2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_line2.paragraph_format.space_after = Pt(4)
    r_l2 = p_line2.add_run("––––––––––––––––––––")
    r_l2.font.size = Pt(8)

    p6 = col2.add_paragraph()
    p6.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p6.paragraph_format.space_after = Pt(12)
    now = datetime.now()
    r6 = p6.add_run(f"${location}, ngày {now.day} tháng {now.month} năm {now.year}")
    r6.font.name = 'Times New Roman'
    r6.font.size = Pt(13)
    r6.italic = True

    # 3. NỘI DUNG VĂN BẢN
    raw_markdown = """${cleanBodyText}"""
    
    lines = raw_markdown.split('\\n')
    for line in lines:
        l = line.strip()
        if not l or l.startswith('---'):
            continue
            
        # Tiêu đề chính
        if l.startswith('# ') or l.upper().startswith('BÁO CÁO'):
            clean = l.lstrip('#').strip()
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(clean.upper())
            run.font.name = 'Times New Roman'
            run.font.size = Pt(15)
            run.bold = True
        # Trích yếu
        elif l.startswith('V/v') or l.startswith('Về việc') or l.startswith('## V/v') or l.startswith('## Về việc'):
            clean = l.lstrip('#').strip()
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_after = Pt(14)
            run = p.add_run(clean)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(13)
            run.bold = True
        # Đề mục lớn La Mã (I., II., III., IV.)
        elif any(l.startswith(f"{x}.") for x in ['I', 'II', 'III', 'IV', 'V', 'VI']):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(l.upper())
            run.font.name = 'Times New Roman'
            run.font.size = Pt(13)
            run.bold = True
        # Đề mục số 1., 2., 3.
        elif len(l) > 2 and l[0].isdigit() and l[1] == '.':
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(l)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(13)
            run.bold = True
        # Gạch đầu dòng
        elif l.startswith('- ') or l.startswith('* '):
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(l)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(13)
        # Đoạn văn thường: thụt đầu dòng 1.27cm (0.5 inch), căn đều 2 bên, giãn dòng 1.3
        else:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.first_line_indent = Inches(0.5)
            p.paragraph_format.line_spacing = 1.3
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(l)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(13)

    # 4. CHỮ KÝ VÀ NƠI NHẬN (Footer Table 2 cột)
    doc.add_paragraph().paragraph_format.space_after = Pt(10)
    footer_table = doc.add_table(rows=1, cols=2)
    footer_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    footer_table.autofit = False

    for row in footer_table.rows:
        for cell in row.cells:
            tcPr = cell._tc.get_or_add_tcPr()
            tcBorders = parse_xml(r'<w:tcBorders %s><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>' % nsdecls('w'))
            tcPr.append(tcBorders)

    # Cột Nơi nhận
    f_col1 = footer_table.cell(0, 0)
    f_col1.width = Inches(3.2)
    p_nn = f_col1.paragraphs[0]
    p_nn.paragraph_format.space_after = Pt(2)
    r_nn = p_nn.add_run("Nơi nhận:")
    r_nn.bold = True
    r_nn.italic = True
    r_nn.font.size = Pt(12)

    recipients = """${agencyInfo.recipients || 'Công an quận (để b/c);\\nĐảng ủy, UBND phường (để b/c);\\nChỉ huy CAP;\\nLưu: VT, CSKV.'}""".split(';')
    for rec in recipients:
        item = rec.strip()
        if item:
            p_it = f_col1.add_paragraph()
            p_it.paragraph_format.space_after = Pt(2)
            r_it = p_it.add_run(f"- {item}")
            r_it.font.size = Pt(11)

    # Cột Thẩm quyền ký
    f_col2 = footer_table.cell(0, 1)
    f_col2.width = Inches(3.3)
    p_sig = f_col2.paragraphs[0]
    p_sig.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sig.paragraph_format.space_after = Pt(4)
    r_sig = p_sig.add_run("""${signerTitle}""")
    r_sig.bold = True
    r_sig.font.size = Pt(13)

    p_space = f_col2.add_paragraph()
    p_space.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_space.paragraph_format.space_after = Pt(40) # Khoảng trống ký tên
    r_space = p_space.add_run("(Ký, ghi rõ họ tên và đóng dấu)")
    r_space.italic = True
    r_space.font.size = Pt(10)

    p_name = f_col2.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_name = p_name.add_run("""${signerName}""")
    r_name.bold = True
    r_name.font.size = Pt(13)

    output_filename = "Bao_cao_Cong_an_Phuong.docx"
    doc.save(output_filename)
    print(f"[THÀNH CÔNG] Đã tạo file báo cáo chuyên sâu: {output_filename}")

if __name__ == "__main__":
    create_police_report()
`;
}
