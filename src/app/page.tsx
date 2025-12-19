"use client";

import { motion } from 'framer-motion';
import { Calculator, Github, Info } from 'lucide-react';
import { CalculationModeToggle } from '@/components/form/CalculationModeToggle';
import { IncomeForm } from '@/components/form/IncomeForm';
import { MonthlyIncomeTable } from '@/components/form/MonthlyIncomeTable';
import { DeductionForm } from '@/components/form/DeductionForm';
import { TaxSummary } from '@/components/result/TaxSummary';
import { MonthlyTaxChart } from '@/components/result/MonthlyTaxChart';
import { TaxBreakdownTable } from '@/components/result/TaxBreakdownTable';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useTaxStore } from '@/store/tax-store';

export default function Home() {
  const calculate = useTaxStore((state) => state.calculate);
  const calculationMode = useTaxStore((state) => state.calculationMode);
  const yearlyResult = useTaxStore((state) => state.yearlyResult);

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header - Minimal */}
      <header className="border-b border-border/50 bg-card sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Thuế Thu Nhập Cá Nhân</h1>
                <p className="text-[10px] text-muted-foreground">Việt Nam 2025</p>
              </div>
            </motion.div>
            <motion.a
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Info Banner - Flat, minimal */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="mb-6 border-primary/20 bg-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex gap-3">
                <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5 opacity-70" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">
                    Máy tính thuế thu nhập cá nhân Việt Nam 2025
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Sử dụng bảng thuế lũy tiến từng phần chính thức và mức giảm trừ hiện hành theo Luật Thuế TNCN Việt Nam 2025
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-muted-foreground">
                    <span className="bg-muted/50 px-2 py-0.5 rounded">Bản thân: 15,5 triệu/tháng</span>
                    <span className="bg-muted/50 px-2 py-0.5 rounded">Người phụ thuộc: 6,2 triệu/tháng</span>
                    <span className="bg-muted/50 px-2 py-0.5 rounded">Bảo hiểm: 10,5% (mặc định)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input Forms */}
          <div className="space-y-4">
            {/* Calculation Mode Toggle */}
            <CalculationModeToggle />
            
            {/* Conditional Forms based on mode */}
            {calculationMode === 'fixed' ? (
              <>
                <IncomeForm />
                <DeductionForm />
              </>
            ) : (
              <>
                <DeductionForm />
                <MonthlyIncomeTable />
              </>
            )}
            
            {/* Calculate Button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button 
                onClick={calculate}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Calculator className="h-5 w-5 mr-2" />
                TÍNH TOÁN
              </Button>
            </motion.div>
          </div>

          {/* Right Column - TỔNG KẾT THUẾ (bao gồm tất cả) */}
          <div>
            <TaxSummary />
          </div>
        </div>

        {/* Full Width - Charts and Breakdown */}
        <div className="mt-6 space-y-6">
          {calculationMode === 'monthly' && yearlyResult && yearlyResult.monthlyResults.length > 0 && (
            <MonthlyTaxChart yearlyResult={yearlyResult} />
          )}
          
          {calculationMode === 'fixed' && <TaxBreakdownTable />}
        </div>

        {/* Footer - Minimal */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 py-6 text-center text-xs text-muted-foreground border-t border-border/50"
        >
          <p className="mb-1">
            © 2025 Tính Thuế Thu Nhập Cá Nhân Việt Nam
          </p>
          <p className="text-[10px] opacity-70">
            Chỉ mang tính chất tham khảo
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
