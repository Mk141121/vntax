/**
 * Tax calculation types for Vietnam Personal Income Tax
 */

// Chế độ tính thuế
export type CalculationMode = 'fixed' | 'monthly';

// Dữ liệu thu nhập 1 tháng
export interface MonthlyIncomeData {
  month: number; // 1-12
  grossIncome: number;
  insuranceSalary: number;
  note?: string;
}

export interface TaxInput {
  grossIncome: number;
  insuranceSalary: number; // Mức lương đóng bảo hiểm (theo HĐLĐ)
  dependents: number;
  insuranceRate: number; // as percentage (e.g., 10.5 for 10.5%)
}

export interface TaxBracket {
  upTo: number;
  rate: number;
}

export interface TaxBreakdown {
  bracket: number;
  from: number;
  to: number;
  taxableAmount: number;
  rate: number;
  tax: number;
}

export interface TaxResult {
  grossIncome: number;
  insuranceSalary: number;
  insuranceDeduction: number;
  personalDeduction: number;
  dependentDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
  breakdown: TaxBreakdown[];
}

// Kết quả thuế 1 tháng
export interface MonthlyTaxResult {
  month: number;
  grossIncome: number;
  insuranceSalary: number;
  insuranceDeduction: number;
  taxableIncome: number;
  tax: number;
  netIncome: number;
}

// Kết quả thuế cả năm (từ monthly data)
export interface YearlyTaxResult {
  calculationMode: CalculationMode;
  monthlyResults: MonthlyTaxResult[];
  totalGrossIncome: number;
  totalInsuranceDeduction: number;
  totalTax: number;
  totalNetIncome: number;
  effectiveRate: number;
  // Giữ lại breakdown cho tương thích
  personalDeduction: number;
  dependentDeduction: number;
}

export interface MonthlyYearlyComparison {
  monthly: {
    gross: number;
    insurance: number;
    tax: number;
    net: number;
  };
  yearly: {
    gross: number;
    insurance: number;
    tax: number;
    net: number;
  };
}
