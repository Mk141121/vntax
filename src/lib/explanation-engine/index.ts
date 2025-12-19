/**
 * Explanation Engine
 * Generates Vietnamese language explanations for tax calculations
 * 
 * Provides clear, educational explanations without encouraging tax evasion
 */

import { TaxEngineResult } from '../tax-engine';
import { InsuranceResult } from '../insurance-engine';

export interface TaxExplanation {
  summary: string;
  incomeBreakdown: string;
  insuranceExplanation: string;
  deductionsExplanation: string;
  taxCalculation: string;
  effectiveRateExplanation: string;
  suggestions: string[];
}

/**
 * Format currency to Vietnamese style
 */
function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

/**
 * Format percentage
 */
function formatPercent(rate: number): string {
  return rate.toFixed(2) + '%';
}

/**
 * Generate income breakdown explanation
 */
function explainIncomeBreakdown(result: TaxEngineResult): string {
  const parts: string[] = [];
  
  if (result.contractIncome > 0) {
    parts.push(`Thu nhập từ HĐLĐ: ${formatVND(result.contractIncome)} (áp dụng thuế lũy tiến)`);
  }
  
  if (result.nonContractIncome > 0) {
    parts.push(`Thu nhập không HĐLĐ: ${formatVND(result.nonContractIncome)} (khấu trừ 10% flat)`);
  }
  
  if (result.bonusIncome > 0) {
    parts.push(`Thưởng: ${formatVND(result.bonusIncome)} (khấu trừ 10% flat)`);
  }
  
  if (parts.length === 0) {
    return 'Chưa có thu nhập nào được nhập.';
  }
  
  return parts.join('\n');
}

/**
 * Generate insurance explanation
 */
function explainInsurance(
  insuranceResult: InsuranceResult,
  contractIncome: number
): string {
  const { insuranceSalary, insuranceRate, insuranceDeduction } = insuranceResult;
  
  let explanation = `Bảo hiểm được tính trên mức lương đóng BH: ${formatVND(insuranceSalary)}\n`;
  explanation += `Tỷ lệ đóng: ${formatPercent(insuranceRate)}\n`;
  explanation += `Số tiền đóng BH: ${formatVND(insuranceDeduction)}`;
  
  if (insuranceSalary < contractIncome) {
    explanation += `\n\n⚠️ Lưu ý: Mức lương đóng BH (${formatVND(insuranceSalary)}) thấp hơn thu nhập HĐLĐ (${formatVND(contractIncome)}). Đây là hợp pháp nếu đúng với HĐLĐ.`;
  }
  
  if (insuranceResult.warnings.length > 0) {
    explanation += '\n\n⚠️ ' + insuranceResult.warnings.join('\n⚠️ ');
  }
  
  return explanation;
}

/**
 * Generate deductions explanation
 */
function explainDeductions(result: TaxEngineResult): string {
  let explanation = 'Các khoản giảm trừ (CHỈ áp dụng cho thu nhập HĐLĐ):\n\n';
  
  explanation += `1. Bảo hiểm: ${formatVND(result.insuranceDeduction)}\n`;
  explanation += `2. Giảm trừ bản thân: ${formatVND(result.personalDeduction)}\n`;
  
  if (result.dependentDeduction > 0) {
    const dependents = Math.round(result.dependentDeduction / 6_200_000);
    explanation += `3. Giảm trừ người phụ thuộc: ${formatVND(result.dependentDeduction)} (${dependents} người)\n`;
  }
  
  explanation += `\nTổng giảm trừ: ${formatVND(result.totalDeductions)}`;
  
  if (result.nonContractIncome > 0 || result.bonusIncome > 0) {
    explanation += '\n\n⚠️ Lưu ý: Thu nhập không HĐLĐ và thưởng KHÔNG được áp dụng các khoản giảm trừ này.';
  }
  
  return explanation;
}

/**
 * Generate tax calculation explanation
 */
function explainTaxCalculation(result: TaxEngineResult): string {
  let explanation = '';
  
  // Contract income tax
  if (result.contractIncome > 0) {
    explanation += `Thu nhập HĐLĐ chịu thuế: ${formatVND(result.taxableIncome)}\n`;
    explanation += `(${formatVND(result.contractIncome)} - ${formatVND(result.totalDeductions)})\n\n`;
    
    if (result.breakdown.length > 0) {
      explanation += 'Thuế lũy tiến:\n';
      result.breakdown.forEach((bracket) => {
        explanation += `  Bậc ${bracket.bracket}: ${formatVND(bracket.taxableAmount)} × ${formatPercent(bracket.rate * 100)} = ${formatVND(bracket.tax)}\n`;
      });
      explanation += `Tổng thuế lũy tiến: ${formatVND(result.progressiveTax)}\n\n`;
    }
  }
  
  // Non-contract income tax
  if (result.nonContractIncome > 0) {
    explanation += `Thu nhập không HĐLĐ: ${formatVND(result.nonContractIncome)}\n`;
    explanation += `Thuế khấu trừ 10%: ${formatVND(result.nonContractTax)}\n\n`;
  }
  
  // Bonus tax
  if (result.bonusIncome > 0) {
    explanation += `Thưởng: ${formatVND(result.bonusIncome)}\n`;
    explanation += `Thuế khấu trừ 10%: ${formatVND(result.bonusTax)}\n\n`;
  }
  
  explanation += `Tổng thuế TNCN: ${formatVND(result.totalTax)}`;
  
  return explanation;
}

/**
 * Generate effective rate explanation
 */
function explainEffectiveRate(result: TaxEngineResult): string {
  const { effectiveTaxRate, totalIncome, totalTax } = result;
  
  let explanation = `Thuế suất hiệu dụng: ${formatPercent(effectiveTaxRate)}\n`;
  explanation += `(${formatVND(totalTax)} / ${formatVND(totalIncome)} × 100%)`;
  
  if (effectiveTaxRate < 5) {
    explanation += '\n\nĐây là mức thuế rất thấp.';
  } else if (effectiveTaxRate < 10) {
    explanation += '\n\nĐây là mức thuế hợp lý cho thu nhập trung bình.';
  } else if (effectiveTaxRate < 20) {
    explanation += '\n\nĐây là mức thuế khá cao cho thu nhập cao.';
  } else {
    explanation += '\n\nĐây là mức thuế rất cao, phù hợp với thu nhập rất cao.';
  }
  
  return explanation;
}

/**
 * Generate suggestions
 */
function generateSuggestions(
  result: TaxEngineResult,
  insuranceResult: InsuranceResult
): string[] {
  const suggestions: string[] = [];
  
  // Insurance salary check
  if (insuranceResult.insuranceSalary < result.contractIncome) {
    suggestions.push('Nếu tăng mức lương đóng BH, bạn sẽ tăng chi phí BH nhưng giảm thuế TNCN (có thể tiết kiệm tổng thể).');
  }
  
  // Dependent deduction
  if (result.dependentDeduction === 0) {
    suggestions.push('Nếu bạn có người phụ thuộc hợp lệ, hãy khai báo để được giảm trừ 6.2 triệu/người/tháng.');
  }
  
  // High non-contract income
  if (result.nonContractIncome > result.contractIncome * 0.3) {
    suggestions.push('Thu nhập không HĐLĐ chiếm tỷ trọng cao. Cân nhắc chuyển sang HĐLĐ để được hưởng các khoản giảm trừ.');
  }
  
  // Legal compliance
  suggestions.push('Luôn tuân thủ pháp luật thuế. Khai báo đúng, đủ, đúng hạn.');
  
  return suggestions;
}

/**
 * Generate complete tax explanation
 */
export function generateTaxExplanation(
  taxResult: TaxEngineResult,
  insuranceResult: InsuranceResult
): TaxExplanation {
  const summary = `Tổng thu nhập: ${formatVND(taxResult.totalIncome)}\n` +
    `Bảo hiểm: ${formatVND(taxResult.insuranceDeduction)}\n` +
    `Thuế TNCN: ${formatVND(taxResult.totalTax)}\n` +
    `Thu nhập ròng: ${formatVND(taxResult.netIncome)}`;
  
  return {
    summary,
    incomeBreakdown: explainIncomeBreakdown(taxResult),
    insuranceExplanation: explainInsurance(insuranceResult, taxResult.contractIncome),
    deductionsExplanation: explainDeductions(taxResult),
    taxCalculation: explainTaxCalculation(taxResult),
    effectiveRateExplanation: explainEffectiveRate(taxResult),
    suggestions: generateSuggestions(taxResult, insuranceResult)
  };
}
