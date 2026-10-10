import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  convertMillimetersToTwip,
  UnderlineType,
} from 'docx';
import { AgencyInfo } from '../types';

/**
 * Xuất file Word (.docx) chuẩn thể thức văn bản hành chính Công an Nhân dân
 * Lề trang: Trên 20mm, Dưới 20mm, Trái 30mm, Phải 20mm
 * Phông chữ: Times New Roman, cỡ 13-14pt
 */
export async function generateDocxBlob(
  markdownContent: string,
  agencyInfo: AgencyInfo
): Promise<Blob> {
  const sections: any[] = [];

  // 1. Khung Tiêu đề đầu văn bản (Header Table 2 cột không viền)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    },
    rows: [
      new TableRow({
        children: [
          // Cột trái: Tên cơ quan ban hành + Số ký hiệu
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (agencyInfo.superiorOrg || 'CÔNG AN QUẬN HOÀN KIẾM').toUpperCase(),
                    font: 'Times New Roman',
                    size: 24, // 12pt
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (agencyInfo.issuingAgency || 'CÔNG AN PHƯỜNG HÀNG TRỐNG').toUpperCase(),
                    bold: true,
                    font: 'Times New Roman',
                    size: 24, // 12pt
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '––––––––––––',
                    font: 'Times New Roman',
                    size: 16,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Số: ${agencyInfo.reportNumber || '.../BC-CAP'}`,
                    font: 'Times New Roman',
                    size: 24, // 12pt
                  }),
                ],
              }),
            ],
          }),
          // Cột phải: Quốc hiệu + Tiêu ngữ + Địa danh, ngày tháng
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                    bold: true,
                    font: 'Times New Roman',
                    size: 24, // 12pt
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Độc lập - Tự do - Hạnh phúc',
                    bold: true,
                    font: 'Times New Roman',
                    size: 26, // 13pt
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '––––––––––––––––––––',
                    font: 'Times New Roman',
                    size: 18,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${agencyInfo.location || 'Hà Nội'}, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`,
                    italics: true,
                    font: 'Times New Roman',
                    size: 26, // 13pt
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  sections.push(headerTable);
  sections.push(new Paragraph({ spacing: { after: 240 } })); // Khoảng cách

  // Parse nội dung markdown
  const lines = markdownContent.split('\n');
  let inConfirmationBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) {
      continue;
    }

    // Bỏ qua đoạn xác nhận ban đầu nếu muốn văn bản sạch hoặc giữ nguyên
    if (rawLine.startsWith('---') || rawLine.includes('XÁC NHẬN CÁN BỘ CÔNG AN')) {
      inConfirmationBlock = !inConfirmationBlock;
      continue;
    }
    if (inConfirmationBlock) {
      continue;
    }

    // Tiêu đề cấp 1 (BÁO CÁO, # BÁO CÁO, ...)
    if (rawLine.startsWith('# ') || rawLine.toUpperCase().startsWith('BÁO CÁO')) {
      const cleanTitle = rawLine.replace(/^#+\s*/, '').trim();
      sections.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 120 },
          children: [
            new TextRun({
              text: cleanTitle.toUpperCase(),
              bold: true,
              font: 'Times New Roman',
              size: 30, // 15pt
            }),
          ],
        })
      );
      continue;
    }

    // Trích yếu (Về việc...)
    if (rawLine.startsWith('V/v') || rawLine.startsWith('Về việc') || rawLine.startsWith('## Về việc')) {
      const cleanSubtitle = rawLine.replace(/^#+\s*/, '').trim();
      sections.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: cleanSubtitle,
              bold: true,
              font: 'Times New Roman',
              size: 26, // 13pt
            }),
          ],
        })
      );
      continue;
    }

    // Đề mục lớn La Mã (I., II., III., IV.)
    if (/^[I|V|X]+\.\s+/i.test(rawLine) || rawLine.startsWith('## ')) {
      const headingText = rawLine.replace(/^#+\s*/, '').trim();
      sections.push(
        new Paragraph({
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: headingText.toUpperCase(),
              bold: true,
              font: 'Times New Roman',
              size: 28, // 14pt
            }),
          ],
        })
      );
      continue;
    }

    // Đề mục số 1., 2., 3.
    if (/^\d+\.\s+/i.test(rawLine) || rawLine.startsWith('### ')) {
      const subHeadingText = rawLine.replace(/^#+\s*/, '').trim();
      sections.push(
        new Paragraph({
          spacing: { before: 160, after: 80 },
          children: [
            new TextRun({
              text: subHeadingText,
              bold: true,
              font: 'Times New Roman',
              size: 26, // 13pt
            }),
          ],
        })
      );
      continue;
    }

    // Gạch đầu dòng (- hoặc *)
    if (rawLine.startsWith('- ') || rawLine.startsWith('* ')) {
      const bulletText = rawLine.replace(/^[-*]\s*/, '').trim();
      sections.push(
        new Paragraph({
          indent: { left: convertMillimetersToTwip(10), firstLine: convertMillimetersToTwip(0) },
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `- ${bulletText}`,
              font: 'Times New Roman',
              size: 26, // 13pt
            }),
          ],
        })
      );
      continue;
    }

    // Đoạn văn thông thường (Thụt lề 1.27cm, căn đều 2 bên)
    sections.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: convertMillimetersToTwip(12.7) }, // Thụt lề đầu dòng 1.27cm
        spacing: { line: 280, after: 120 }, // Giãn dòng 1.4
        children: [
          new TextRun({
            text: rawLine,
            font: 'Times New Roman',
            size: 26, // 13pt
          }),
        ],
      })
    );
  }

  // 3. Khung Chữ ký & Nơi nhận (Footer Table 2 cột không viền chuẩn NĐ 30)
  const recipientsList = (agencyInfo.recipients || 'Công an Quận (để b/c);\nĐảng ủy, UBND Phường (để b/c);\nChỉ huy CAP;\nLưu: VT, CSKV.')
    .split(/;|\n/)
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  const recipientParagraphs = [
    new Paragraph({
      children: [
        new TextRun({
          text: 'Nơi nhận:',
          bold: true,
          italics: true,
          font: 'Times New Roman',
          size: 24, // 12pt
        }),
      ],
    }),
    ...recipientsList.map(
      (item) =>
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `- ${item}`,
              font: 'Times New Roman',
              size: 22, // 11pt
            }),
          ],
        })
    ),
  ];

  const signerCell = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (agencyInfo.signerTitle || 'TRƯỞNG CÔNG AN PHƯỜNG').toUpperCase(),
          bold: true,
          font: 'Times New Roman',
          size: 26, // 13pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 720, after: 120 }, // Chừa chỗ ký tên đóng dấu
      children: [
        new TextRun({
          text: '(Ký, ghi rõ họ tên và đóng dấu)',
          italics: true,
          font: 'Times New Roman',
          size: 20, // 10pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${agencyInfo.signerRank || 'Trung tá'} ${agencyInfo.signerName || 'Nguyễn Văn Hùng'}`,
          bold: true,
          font: 'Times New Roman',
          size: 26, // 13pt
        }),
      ],
    }),
  ];

  const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: recipientParagraphs,
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: signerCell,
          }),
        ],
      }),
    ],
  });

  sections.push(new Paragraph({ spacing: { before: 240 } }));
  sections.push(footerTable);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertMillimetersToTwip(20),    // 20mm
              bottom: convertMillimetersToTwip(20), // 20mm
              left: convertMillimetersToTwip(30),   // 30mm (chuẩn lề trái đóng gáy theo NĐ 30)
              right: convertMillimetersToTwip(20),  // 20mm
            },
          },
        },
        children: sections,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
