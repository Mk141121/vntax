import jsPDF from 'jspdf';
import { TaxResult, YearlyTaxResult, MonthlyTaxResult } from './tax/types';
import { formatCurrency } from './utils';

/**
 * Export tax result as a simple, text-based professional PDF
 * Suitable for printing, sending to accountants, and archival
 */
export async function exportTaxResultToPDFSimple(
  result: TaxResult | null,
  yearlyResult: YearlyTaxResult | null,
  calculationMode: 'fixed' | 'monthly',
  dependents: number,
  insuranceRate: number
) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  // Use times font for better Vietnamese support
  pdf.setFont('times', 'normal');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 25; // Increased margin for better look
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin + 5;

  // Helper function to add text with proper encoding
  const addText = (text: string, fontSize: number, align: 'left' | 'center' | 'right' = 'left', bold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('times', bold ? 'bold' : 'normal');
    
    if (align === 'center') {
      pdf.text(text, pageWidth / 2, yPos, { align: 'center', maxWidth: contentWidth });
    } else if (align === 'right') {
      pdf.text(text, pageWidth - margin, yPos, { align: 'right' });
    } else {
      pdf.text(text, margin, yPos, { maxWidth: contentWidth });
    }
    
    yPos += fontSize * 0.5 + 2; // Better line spacing
  };

  // Helper function to add line
  const addLine = () => {
    yPos += 4;
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(100, 100, 100); // Gray color
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
  };

  // Helper function to add row with label and value
  const addRow = (label: string, value: string, bold: boolean = false, indent: number = 0) => {
    pdf.setFontSize(11);
    pdf.setFont('times', bold ? 'bold' : 'normal');
    pdf.text(label, margin + indent, yPos);
    pdf.text(value, pageWidth - margin, yPos, { align: 'right' });
    yPos += 7; // Better row spacing
  };

  // Helper function to check page break
  const checkPageBreak = (neededSpace: number = 20) => {
    if (yPos + neededSpace > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // ===========================================
  // 1. HEADER
  // ===========================================
  yPos += 5;
  addText('TỔNG KẾT THUẾ TNCN', 20, 'center', true);
  yPos += 3;
  addText('Tính toán tổng thu nhập và thuế thu nhập cá nhân', 11, 'center', false);
  yPos += 8;
  addLine();

  // ===========================================
  // 2. THÔNG TIN CHUNG
  // ===========================================
  yPos += 2;
  addText('THÔNG TIN CHUNG', 13, 'left', true);
  yPos += 5;

  // Current date
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('vi-VN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  pdf.setFontSize(11);
  pdf.setFont('times', 'normal');
  
  const labelX = margin + 5;
  const valueX = margin + 75;
  
  // Left column labels
  pdf.text('Khoảng thời gian:', labelX, yPos);
  pdf.text('Số người phụ thuộc:', labelX, yPos + 7);
  pdf.text('Chế độ tính:', labelX, yPos + 14);
  pdf.text('Tỷ lệ bảo hiểm:', labelX, yPos + 21);
  
  // Right column values
  pdf.text('01/2025 - 12/2025', valueX, yPos);
  pdf.text(`${dependents} người`, valueX, yPos + 7);
  pdf.text(calculationMode === 'fixed' ? 'Thu nhập cố định' : 'Thu nhập theo tháng', valueX, yPos + 14);
  pdf.text(`${insuranceRate}%`, valueX, yPos + 21);

  yPos += 28;
  addLine();

  // ===========================================
  // 3. TỔNG KẾT THU NHẬP & KHẤU TRỪ
  // ===========================================
  checkPageBreak(60);
  yPos += 2;
  addText('TỔNG KẾT THU NHẬP & KHẤU TRỪ', 13, 'left', true);
  yPos += 5;

  if (calculationMode === 'fixed' && result) {
    addRow('Tổng thu nhập:', formatCurrency(result.grossIncome * 12));
    addRow('Lương đóng bảo hiểm:', formatCurrency(result.insuranceSalary * 12));
    addRow('Tiền bảo hiểm:', formatCurrency(result.insuranceDeduction * 12));
    addRow('Giảm trừ bản thân:', formatCurrency(result.personalDeduction * 12));
    if (result.dependentDeduction > 0) {
      addRow('Giảm trừ người phụ thuộc:', formatCurrency(result.dependentDeduction * 12));
    }
  } else if (calculationMode === 'monthly' && yearlyResult) {
    addRow('Tổng thu nhập:', formatCurrency(yearlyResult.totalGrossIncome));
    addRow('Lương đóng bảo hiểm:', formatCurrency(yearlyResult.totalGrossIncome));
    addRow('Tiền bảo hiểm:', formatCurrency(yearlyResult.totalInsuranceDeduction));
    addRow('Giảm trừ bản thân:', formatCurrency(yearlyResult.personalDeduction));
    if (yearlyResult.dependentDeduction > 0) {
      addRow('Giảm trừ người phụ thuộc:', formatCurrency(yearlyResult.dependentDeduction));
    }
  }

  yPos += 2;
  addLine();

  // ===========================================
  // 4. THU NHẬP CHỊU THUẾ & THUẾ
  // ===========================================
  checkPageBreak(30);
  yPos += 2;
  addText('THU NHẬP CHỊU THUẾ & THUẾ TNCN', 13, 'left', true);
  yPos += 5;

  if (calculationMode === 'fixed' && result) {
    addRow('Thu nhập chịu thuế:', formatCurrency(result.taxableIncome * 12));
    addRow('Thuế TNCN phải nộp:', formatCurrency(result.totalTax * 12));
  } else if (calculationMode === 'monthly' && yearlyResult) {
    // Calculate total taxable income from monthly results
    const totalTaxableIncome = yearlyResult.monthlyResults.reduce((sum, m) => sum + m.taxableIncome, 0);
    addRow('Thu nhập chịu thuế:', formatCurrency(totalTaxableIncome));
    addRow('Thuế TNCN phải nộp:', formatCurrency(yearlyResult.totalTax));
  }

  yPos += 2;
  addLine();

  // ===========================================
  // 5. THỰC NHẬN (EMPHASIZED)
  // ===========================================
  checkPageBreak(30);
  yPos += 5;
  
  const netIncome = calculationMode === 'fixed' && result 
    ? result.netIncome * 12 
    : yearlyResult?.totalNetIncome || 0;
  
  // Add a subtle background box
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin - 5, yPos - 5, contentWidth + 10, 14, 'F');
  
  pdf.setFontSize(15);
  pdf.setFont('times', 'bold');
  pdf.text('THỰC NHẬN CẢ NĂM:', margin, yPos + 3);
  pdf.text(formatCurrency(netIncome), pageWidth - margin, yPos + 3, { align: 'right' });
  yPos += 18;
  
  addLine();

  // ===========================================
  // 6. CHI TIẾT THEO THÁNG (if monthly mode)
  // ===========================================
  if (calculationMode === 'monthly' && yearlyResult && yearlyResult.monthlyResults.length > 0) {
    checkPageBreak(100);
    
    yPos += 2;
    addText('CHI TIẾT THEO THÁNG', 13, 'left', true);
    yPos += 7;

    // Table header
    pdf.setFontSize(10);
    pdf.setFont('times', 'bold');
    
    const colWidths = {
      month: 20,
      income: 38,
      insurance: 38,
      tax: 38,
      net: 38
    };
    
    let xPos = margin;
    pdf.text('Tháng', xPos, yPos);
    xPos += colWidths.month;
    pdf.text('Thu nhập', xPos, yPos);
    xPos += colWidths.income;
    pdf.text('Bảo hiểm', xPos, yPos);
    xPos += colWidths.insurance;
    pdf.text('Thuế TNCN', xPos, yPos);
    xPos += colWidths.tax;
    pdf.text('Thực nhận', xPos, yPos);
    
    yPos += 5;
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(100, 100, 100);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;

    // Table rows
    pdf.setFontSize(10);
    pdf.setFont('times', 'normal');
    yearlyResult.monthlyResults.forEach((month: MonthlyTaxResult) => {
      checkPageBreak(9);
      
      xPos = margin;
      pdf.text(`Tháng ${month.month}`, xPos, yPos);
      xPos += colWidths.month;
      pdf.text(formatCurrency(month.grossIncome), xPos, yPos);
      xPos += colWidths.income;
      pdf.text(formatCurrency(month.insuranceDeduction), xPos, yPos);
      xPos += colWidths.insurance;
      pdf.text(formatCurrency(month.tax), xPos, yPos);
      xPos += colWidths.tax;
      pdf.text(formatCurrency(month.netIncome), xPos, yPos);
      
      yPos += 6;
    });
    
    yPos += 2;
    addLine();
  }

  // ===========================================
  // 7. FOOTER
  // ===========================================
  // Go to bottom of page
  yPos = pageHeight - margin - 18;
  
  pdf.setFontSize(9);
  pdf.setFont('times', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Ngày xuất PDF: ${dateStr}`, margin, yPos);
  
  yPos += 7;
  pdf.setFontSize(9);
  pdf.setFont('times', 'normal');
  
  const disclaimer = 'Tài liệu được hệ thống tự động tính toán, chỉ mang tính chất tham khảo.';
  pdf.text(disclaimer, pageWidth / 2, yPos, { align: 'center', maxWidth: contentWidth });
  
  yPos += 5;
  const disclaimer2 = 'Vui lòng đối chiếu với kế toán hoặc cơ quan thuế.';
  pdf.text(disclaimer2, pageWidth / 2, yPos, { align: 'center', maxWidth: contentWidth });

  // Save PDF
  const fileName = `Tong-ket-thue-TNCN-${dateStr.replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
}
