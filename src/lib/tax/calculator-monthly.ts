import { MonthlyIncomeData, MonthlyTaxResult, YearlyTaxResult } from './types';
import { PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } from './rules-2025';
import { calculateProgressiveTax } from './progressive';

/**
 * Tính thuế cho 1 tháng
 */
export function calculateMonthlyTax(
  monthData: MonthlyIncomeData,
  dependents: number,
  insuranceRate: number
): MonthlyTaxResult {
  const { month, grossIncome, insuranceSalary } = monthData;

  // Bảo hiểm = Lương đóng BH × Tỷ lệ
  const insuranceDeduction = insuranceSalary * (insuranceRate / 100);

  // Giảm trừ cá nhân và người phụ thuộc (theo tháng)
  const personalDeduction = PERSONAL_DEDUCTION;
  const dependentDeduction = DEPENDENT_DEDUCTION * dependents;

  // Thu nhập chịu thuế = Gross - Bảo hiểm - Giảm trừ
  const taxableIncome = Math.max(
    0,
    grossIncome - insuranceDeduction - personalDeduction - dependentDeduction
  );

  // Tính thuế lũy tiến
  const { tax } = calculateProgressiveTax(taxableIncome);

  // Thực nhận = Gross - Bảo hiểm - Thuế
  const netIncome = grossIncome - insuranceDeduction - tax;

  return {
    month,
    grossIncome,
    insuranceSalary,
    insuranceDeduction,
    taxableIncome,
    tax,
    netIncome,
  };
}

/**
 * Tính thuế cho cả năm từ dữ liệu 12 tháng
 */
export function calculateYearlyTaxFromMonthly(
  monthlyData: MonthlyIncomeData[],
  dependents: number,
  insuranceRate: number
): YearlyTaxResult {
  // Tính từng tháng
  const monthlyResults = monthlyData.map((data) =>
    calculateMonthlyTax(data, dependents, insuranceRate)
  );

  // Tổng hợp
  const totalGrossIncome = monthlyResults.reduce((sum, m) => sum + m.grossIncome, 0);
  const totalInsuranceDeduction = monthlyResults.reduce((sum, m) => sum + m.insuranceDeduction, 0);
  const totalTax = monthlyResults.reduce((sum, m) => sum + m.tax, 0);
  const totalNetIncome = monthlyResults.reduce((sum, m) => sum + m.netIncome, 0);

  const effectiveRate = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0;

  return {
    calculationMode: 'monthly',
    monthlyResults,
    totalGrossIncome,
    totalInsuranceDeduction,
    totalTax,
    totalNetIncome,
    effectiveRate,
    personalDeduction: PERSONAL_DEDUCTION * 12,
    dependentDeduction: DEPENDENT_DEDUCTION * dependents * 12,
  };
}

/**
 * Tạo dữ liệu mặc định cho 12 tháng
 */
export function createDefaultMonthlyData(): MonthlyIncomeData[] {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    grossIncome: 0,
    insuranceSalary: 0,
    note: '',
  }));
}

/**
 * Sao chép dữ liệu từ tháng trước
 */
export function copyFromPreviousMonth(
  monthlyData: MonthlyIncomeData[],
  fromMonth: number
): MonthlyIncomeData[] {
  if (fromMonth < 1 || fromMonth > 12) return monthlyData;
  
  const sourceData = monthlyData[fromMonth - 1];
  const newData = [...monthlyData];
  
  for (let i = fromMonth; i < 12; i++) {
    newData[i] = {
      ...newData[i],
      grossIncome: sourceData.grossIncome,
      insuranceSalary: sourceData.insuranceSalary,
    };
  }
  
  return newData;
}
