import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TaxResult } from './tax/types';
import { formatCurrency } from './utils';

/**
 * Export PDF từ HTML element (giống 100% web)
 * Sử dụng html2canvas để capture giao diện
 */
export async function exportTaxResultToPDFFromWeb(taxResult: TaxResult) {
  try {
    // Tìm element chứa toàn bộ TỔNG KẾT THUẾ
    const summaryElement = document.getElementById('tax-summary-container');
    
    if (!summaryElement) {
      console.error('Không tìm thấy element tax-summary-container');
      return;
    }

    // Hiển thị loading
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50';
    loadingToast.textContent = 'Đang tạo PDF...';
    document.body.appendChild(loadingToast);

    // Scroll to top trước khi capture
    window.scrollTo(0, 0);
    
    // Đợi một chút để đảm bảo scroll hoàn tất
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture element thành canvas với quality cao
    const canvas = await html2canvas(summaryElement, {
      scale: 2, // Tăng resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#1a202c', // Dark background
      windowWidth: summaryElement.scrollWidth,
      windowHeight: summaryElement.scrollHeight,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
    });

    // Tạo PDF với chiến lược fit-to-page
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Nếu nội dung vừa 1 trang, add trực tiếp
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Nếu quá dài, scale down để vừa 1 trang
      const scaledHeight = pageHeight - 20; // Trừ margin
      const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
      const xOffset = (imgWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'PNG', xOffset, 10, scaledWidth, scaledHeight);
    }

    // Add footer với thông tin
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    const footerText = `Tổng Kết Thuế TNCN - ${new Date().toLocaleDateString('vi-VN')}`;
    pdf.text(footerText, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Save PDF
    const fileName = `Tong-Ket-Thue-TNCN-${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.pdf`;
    pdf.save(fileName);

    // Remove loading
    document.body.removeChild(loadingToast);

    // Show success message
    const successToast = document.createElement('div');
    successToast.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successToast.textContent = '✓ Đã tải PDF thành công';
    document.body.appendChild(successToast);
    setTimeout(() => {
      document.body.removeChild(successToast);
    }, 3000);

  } catch (error) {
    console.error('Lỗi khi tạo PDF:', error);
    alert('Có lỗi khi tạo PDF. Vui lòng thử lại.');
  }
}
