import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TaxResult, YearlyTaxResult, MonthlyTaxResult } from './tax/types';
import { formatCurrency } from './utils';

/**
 * Export tax result as a professional PDF using HTML template
 * Perfect Vietnamese rendering with clean, print-ready layout
 */
export async function exportTaxResultToPDFSimple(
  result: TaxResult | null,
  yearlyResult: YearlyTaxResult | null,
  calculationMode: 'fixed' | 'monthly',
  dependents: number,
  insuranceRate: number
) {
  // Prepare data
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('vi-VN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  const netIncome = calculationMode === 'fixed' && result 
    ? result.netIncome * 12 
    : yearlyResult?.totalNetIncome || 0;

  // Create hidden container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.width = '210mm'; // A4 width
  container.style.padding = '20mm';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.color = '#000000';
  container.style.fontSize = '11pt';
  container.style.lineHeight = '1.6';

  // Build HTML content
  let html = `
    <div style="max-width: 170mm;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333;">
        <h1 style="font-size: 22pt; font-weight: bold; margin: 0 0 10px 0; letter-spacing: 2px;">TỔNG KẾT THUẾ TNCN</h1>
        <p style="font-size: 11pt; color: #555; margin: 0;">Tính toán tổng thu nhập và thuế thu nhập cá nhân</p>
      </div>

      <!-- Thông tin chung -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 13pt; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase;">THÔNG TIN CHUNG</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; width: 45%;">Khoảng thời gian:</td>
            <td style="padding: 6px 0; font-weight: 600;">01/2025 - 12/2025</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Số người phụ thuộc:</td>
            <td style="padding: 6px 0; font-weight: 600;">${dependents} người</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Chế độ tính:</td>
            <td style="padding: 6px 0; font-weight: 600;">${calculationMode === 'fixed' ? 'Thu nhập cố định' : 'Thu nhập theo tháng'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Tỷ lệ bảo hiểm:</td>
            <td style="padding: 6px 0; font-weight: 600;">${insuranceRate}%</td>
          </tr>
        </table>
      </div>

      <div style="border-top: 1px solid #ddd; margin: 25px 0;"></div>

      <!-- Tổng kết thu nhập -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 13pt; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase;">TỔNG KẾT THU NHẬP & KHẤU TRỪ</h2>
        <table style="width: 100%; border-collapse: collapse;">
  `;

  if (calculationMode === 'fixed' && result) {
    html += `
          <tr>
            <td style="padding: 6px 0;">Tổng thu nhập:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(result.grossIncome * 12)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Lương đóng bảo hiểm:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(result.insuranceSalary * 12)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Tiền bảo hiểm:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(result.insuranceDeduction * 12)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Giảm trừ bản thân:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(result.personalDeduction * 12)}</td>
          </tr>
    `;
    if (result.dependentDeduction > 0) {
      html += `
          <tr>
            <td style="padding: 6px 0;">Giảm trừ người phụ thuộc:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(result.dependentDeduction * 12)}</td>
          </tr>
      `;
    }
  } else if (calculationMode === 'monthly' && yearlyResult) {
    html += `
          <tr>
            <td style="padding: 6px 0;">Tổng thu nhập:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(yearlyResult.totalGrossIncome)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Lương đóng bảo hiểm:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(yearlyResult.totalGrossIncome)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Tiền bảo hiểm:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(yearlyResult.totalInsuranceDeduction)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Giảm trừ bản thân:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(yearlyResult.personalDeduction)}</td>
          </tr>
    `;
    if (yearlyResult.dependentDeduction > 0) {
      html += `
          <tr>
            <td style="padding: 6px 0;">Giảm trừ người phụ thuộc:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(yearlyResult.dependentDeduction)}</td>
          </tr>
      `;
    }
  }

  html += `
        </table>
      </div>

      <div style="border-top: 1px solid #ddd; margin: 25px 0;"></div>

      <!-- Thu nhập chịu thuế & Thuế -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 13pt; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase;">THU NHẬP CHỊU THUẾ & THUẾ TNCN</h2>
        <table style="width: 100%; border-collapse: collapse;">
  `;

  if (calculationMode === 'fixed' && result) {
    html += `
          <tr>
            <td style="padding: 6px 0;">Thu nhập chịu thuế:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(result.taxableIncome * 12)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Thuế TNCN phải nộp:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(result.totalTax * 12)}</td>
          </tr>
    `;
  } else if (calculationMode === 'monthly' && yearlyResult) {
    const totalTaxableIncome = yearlyResult.monthlyResults.reduce((sum, m) => sum + m.taxableIncome, 0);
    html += `
          <tr>
            <td style="padding: 6px 0;">Thu nhập chịu thuế:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(totalTaxableIncome)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Thuế TNCN phải nộp:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatCurrency(yearlyResult.totalTax)}</td>
          </tr>
    `;
  }

  html += `
        </table>
      </div>

      <div style="border-top: 1px solid #ddd; margin: 25px 0;"></div>

      <!-- Thực nhận - Highlighted -->
      <div style="background: #f5f5f5; padding: 20px; margin: 25px 0; border-radius: 4px; border: 1px solid #ddd;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-size: 16pt; font-weight: bold;">THỰC NHẬN CẢ NĂM:</td>
            <td style="font-size: 16pt; font-weight: bold; text-align: right;">${formatCurrency(netIncome)}</td>
          </tr>
        </table>
      </div>
  `;

  // Monthly details table if applicable
  if (calculationMode === 'monthly' && yearlyResult && yearlyResult.monthlyResults.length > 0) {
    html += `
      <div style="border-top: 1px solid #ddd; margin: 25px 0;"></div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 13pt; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase;">CHI TIẾT THEO THÁNG</h2>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left; font-weight: 600;">Tháng</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: 600;">Thu nhập</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: 600;">Bảo hiểm</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: 600;">Thuế TNCN</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: 600;">Thực nhận</th>
            </tr>
          </thead>
          <tbody>
    `;

    yearlyResult.monthlyResults.forEach((month: MonthlyTaxResult) => {
      html += `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Tháng ${month.month}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(month.grossIncome)}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(month.insuranceDeduction)}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(month.tax)}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(month.netIncome)}</td>
            </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  // Footer
  html += `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 9pt; color: #666;">
        <p style="margin: 0 0 8px 0;">Ngày xuất PDF: ${dateStr}</p>
        <p style="margin: 0; font-style: italic; line-height: 1.5;">
          Tài liệu được hệ thống tự động tính toán, chỉ mang tính chất tham khảo.<br>
          Vui lòng đối chiếu với kế toán hoặc cơ quan thuế.
        </p>
      </div>
    </div>
  `;

  container.innerHTML = html;
  document.body.appendChild(container);

  // Wait for fonts to load
  await document.fonts.ready;

  // Capture with html2canvas
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: container.scrollWidth,
    windowHeight: container.scrollHeight,
  });

  // Remove container
  document.body.removeChild(container);

  // Create PDF
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  // If content is taller than one page, scale to fit
  if (imgHeight > pdfHeight) {
    const scaleFactor = pdfHeight / imgHeight;
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = pdfHeight;
    const xOffset = (pdfWidth - scaledWidth) / 2;
    pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, scaledHeight);
  } else {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  }

  // Save
  const fileName = `Tong-ket-thue-TNCN-${dateStr.replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
}
