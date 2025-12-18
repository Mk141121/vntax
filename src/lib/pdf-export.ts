import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TaxResult } from './tax/types';
import { formatCurrency, formatPercentage } from './utils';

// Hàm chuyển đổi font tiếng Việt (sử dụng Helvetica có sẵn)
// Note: jsPDF có hỗ trợ tiếng Việt với font mặc định Helvetica
export function exportTaxResultToPDF(taxResult: TaxResult, grossIncome: number, dependents: number, insuranceRate: number) {
  const doc = new jsPDF();
  
  // Thiết lập font và encoding cho tiếng Việt
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text('BANG TINH THUE THU NHAP CA NHAN', 105, 20, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('Vietnam Personal Income Tax Calculator', 105, 28, { align: 'center' });
  
  // Ngày xuất
  const today = new Date().toLocaleDateString('vi-VN');
  doc.setFontSize(9);
  doc.text(`Ngay xuat: ${today}`, 105, 35, { align: 'center' });
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 40, 190, 40);
  
  // Thông tin đầu vào
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('THONG TIN DAU VAO', 20, 50);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const inputData = [
    ['Thu Nhap Gop (Gross Income):', formatCurrency(grossIncome)],
    ['So Nguoi Phu Thuoc (Dependents):', dependents.toString()],
    ['Ty Le Bao Hiem (Insurance Rate):', formatPercentage(insuranceRate, 1)],
  ];
  
  let yPos = 58;
  inputData.forEach(([label, value]) => {
    doc.setTextColor(80, 80, 80);
    doc.text(label, 25, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 120, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
  });
  
  // Kết quả chính
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('KET QUA TINH THUE', 20, yPos + 8);
  
  // Box cho thu nhập thực nhận
  yPos += 13;
  doc.setFillColor(220, 252, 231); // green-100
  doc.roundedRect(20, yPos, 170, 20, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61); // green-700
  doc.text('Thu Nhap Thuc Nhan (Net Income):', 25, yPos + 7);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74); // green-600
  doc.text(formatCurrency(taxResult.netIncome), 185, yPos + 7, { align: 'right' });
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Sau khi tru cac khoan giam tru va thue', 25, yPos + 14);
  
  // Bảng chi tiết
  yPos += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('CHI TIET PHAN TICH', 20, yPos);
  
  yPos += 5;
  
  const breakdownData = [
    ['Thu Nhap Gop', formatCurrency(taxResult.grossIncome)],
    ['Bao Hiem (-)', formatCurrency(taxResult.insuranceDeduction), true],
    ['Giam Tru Ban Than (-)', formatCurrency(taxResult.personalDeduction), true],
    ['Giam Tru Nguoi Phu Thuoc (-)', formatCurrency(taxResult.dependentDeduction), true],
    ['Thu Nhap Tinh Thue (=)', formatCurrency(taxResult.taxableIncome)],
    ['Thue TNCN (-)', formatCurrency(taxResult.totalTax), true],
    ['Thu Nhap Thuc Nhan (=)', formatCurrency(taxResult.netIncome), false, true],
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Hang Muc', 'So Tien']],
    body: breakdownData.map(([label, value, isNegative, isBold]) => {
      return [label, value];
    }),
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235], // blue-600
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: function(data) {
      const row = data.row.index;
      if (row === breakdownData.length - 1) {
        // Last row - net income
        data.cell.styles.fillColor = [220, 252, 231]; // green-100
        data.cell.styles.textColor = [22, 163, 74]; // green-600
        data.cell.styles.fontStyle = 'bold';
      } else if (breakdownData[row] && breakdownData[row][2]) {
        // Negative values
        data.cell.styles.textColor = [220, 38, 38]; // red-600
      }
    },
  });
  
  // Bảng thuế lũy tiến
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('BANG PHAN TICH THUE LUY TIEN', 20, yPos);
  
  yPos += 5;
  
  const bracketData = taxResult.breakdown.map(item => [
    `Bac ${item.bracket}`,
    `${formatCurrency(item.from)} - ${item.to === Infinity ? '∞' : formatCurrency(item.to)}`,
    formatPercentage(item.rate * 100, 0),
    formatCurrency(item.taxableAmount),
    formatCurrency(item.tax),
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Bac', 'Khoang Thu Nhap', 'Thue Suat', 'Thu Nhap Tinh Thue', 'Thue']],
    body: bracketData,
    foot: [['', '', 'TONG THUE:', formatCurrency(taxResult.taxableIncome), formatCurrency(taxResult.totalTax)]],
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235], // blue-600
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
    },
    footStyles: {
      fillColor: [243, 244, 246], // gray-100
      textColor: [0, 0, 0],
      fontSize: 9,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 55 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 45, halign: 'right' },
      4: { cellWidth: 45, halign: 'right', textColor: [220, 38, 38] },
    },
  });
  
  // Thông tin bổ sung
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DU KIEN CA NAM (x12 THANG)', 20, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const yearlyData = [
    ['Tong Thu Nhap:', formatCurrency(taxResult.grossIncome * 12)],
    ['Tong Bao Hiem:', formatCurrency(taxResult.insuranceDeduction * 12)],
    ['Tong Thue:', formatCurrency(taxResult.totalTax * 12)],
    ['Thuc Nhan Ca Nam:', formatCurrency(taxResult.netIncome * 12)],
  ];
  
  yearlyData.forEach(([label, value]) => {
    doc.setTextColor(80, 80, 80);
    doc.text(label, 25, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 185, yPos, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    yPos += 6;
  });
  
  // Thuế suất hiệu dụng
  yPos += 3;
  const effectiveRate = (taxResult.totalTax / taxResult.grossIncome) * 100;
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(`Thue suat hieu dung: ${formatPercentage(effectiveRate, 2)}`, 25, yPos);
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Trang ${i} / ${pageCount} - Vietnam Tax Calculator 2025`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Lưu file
  doc.save(`Bang-Tinh-Thue-TNCN-${today.replace(/\//g, '-')}.pdf`);
}
