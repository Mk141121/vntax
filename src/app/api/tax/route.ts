import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateTax, validateTaxInput } from '@/lib/tax/calculator';
import { TaxInput } from '@/lib/tax/types';

// Zod schema for validation
const TaxInputSchema = z.object({
  grossIncome: z.number().min(0, 'Gross income must be non-negative'),
  insuranceSalary: z.number().min(0, 'Insurance salary must be non-negative'),
  dependents: z.number().int().min(0, 'Dependents must be a non-negative integer'),
  insuranceRate: z.number().min(0).max(100, 'Insurance rate must be between 0 and 100'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const parseResult = TaxInputSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input',
          details: parseResult.error.errors 
        },
        { status: 400 }
      );
    }

    const input: TaxInput = parseResult.data;

    // Additional validation
    const validation = validateTaxInput(input);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Calculate tax
    const result = calculateTax(input);

    // Return result
    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Tax calculation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests with query parameters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const grossIncome = Number(searchParams.get('grossIncome') || '0');
    const input: TaxInput = {
      grossIncome,
      insuranceSalary: Number(searchParams.get('insuranceSalary') || grossIncome.toString()),
      dependents: Number(searchParams.get('dependents') || '0'),
      insuranceRate: Number(searchParams.get('insuranceRate') || '10.5'),
    };

    // Validate
    const parseResult = TaxInputSchema.safeParse(input);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input',
          details: parseResult.error.errors 
        },
        { status: 400 }
      );
    }

    // Calculate tax
    const result = calculateTax(input);

    // Return result
    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Tax calculation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
