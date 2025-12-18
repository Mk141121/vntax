import { TaxBracket, TaxBreakdown } from './types';
import { TAX_BRACKETS } from './rules-2025';

/**
 * Calculate progressive tax (lũy tiến từng phần)
 * @param taxableIncome - Income subject to tax
 * @returns Tax amount and detailed breakdown
 */
export function calculateProgressiveTax(
  taxableIncome: number
): { tax: number; breakdown: TaxBreakdown[] } {
  if (taxableIncome <= 0) {
    return { tax: 0, breakdown: [] };
  }

  let remainingIncome = taxableIncome;
  let totalTax = 0;
  let previousLimit = 0;
  const breakdown: TaxBreakdown[] = [];

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];
    const bracketLimit = bracket.upTo;
    const bracketSize = bracketLimit - previousLimit;

    if (remainingIncome <= 0) break;

    // Calculate taxable amount in this bracket
    const taxableInBracket = Math.min(remainingIncome, bracketSize);
    const taxInBracket = taxableInBracket * bracket.rate;

    breakdown.push({
      bracket: i + 1,
      from: previousLimit,
      to: previousLimit + taxableInBracket,
      taxableAmount: taxableInBracket,
      rate: bracket.rate,
      tax: taxInBracket
    });

    totalTax += taxInBracket;
    remainingIncome -= taxableInBracket;
    previousLimit = bracketLimit;

    // Stop if we've used all income or reached infinity bracket
    if (bracketLimit === Infinity || remainingIncome <= 0) break;
  }

  return { tax: totalTax, breakdown };
}

/**
 * Get the tax bracket information for a given income
 * @param taxableIncome - Income to check
 * @returns Bracket information
 */
export function getTaxBracketInfo(taxableIncome: number): {
  bracketNumber: number;
  rate: number;
  from: number;
  to: number;
} {
  if (taxableIncome <= 0) {
    return { bracketNumber: 0, rate: 0, from: 0, to: 0 };
  }

  let previousLimit = 0;
  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];
    if (taxableIncome <= bracket.upTo) {
      return {
        bracketNumber: i + 1,
        rate: bracket.rate,
        from: previousLimit,
        to: bracket.upTo
      };
    }
    previousLimit = bracket.upTo;
  }

  // Should never reach here, but return the last bracket
  const lastBracket = TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return {
    bracketNumber: TAX_BRACKETS.length,
    rate: lastBracket.rate,
    from: previousLimit,
    to: Infinity
  };
}
