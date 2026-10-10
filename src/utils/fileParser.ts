import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

export async function parseUploadedFile(file: File): Promise<{ text: string; fileName: string; fileType: string }> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return {
      text: result.value.trim(),
      fileName: file.name,
      fileType: 'docx',
    };
  }

  if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let fullText = '';
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      fullText += `--- BẢNG TÍNH: ${sheetName} ---\n${csv}\n\n`;
    });
    return {
      text: fullText.trim(),
      fileName: file.name,
      fileType: extension,
    };
  }

  if (extension === 'txt' || extension === 'md') {
    const text = await file.text();
    return {
      text: text.trim(),
      fileName: file.name,
      fileType: 'txt',
    };
  }

  if (extension === 'pdf') {
    // For PDF in browser, read text stream if possible or text reader fallback
    const text = await file.text();
    // In browser without full heavy pdf.js worker bundle, we extract clean ASCII/UTF-8 streams or provide friendly note
    const printable = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
    const cleaned = printable.length > 100 ? printable.slice(0, 50000) : `[Tệp PDF: ${file.name} - Dung lượng: ${(file.size / 1024).toFixed(1)} KB]`;
    return {
      text: cleaned,
      fileName: file.name,
      fileType: 'pdf',
    };
  }

  // Fallback
  const text = await file.text();
  return {
    text: text.trim(),
    fileName: file.name,
    fileType: extension || 'unknown',
  };
}
