"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Wallet, TrendingDown, DollarSign, Info, Download } from 'lucide-react';
import { useTaxStore } from '@/store/tax-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { exportTaxResultToPDF } from '@/lib/pdf-export';

// Animated counter component
function AnimatedCounter({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return <>{formatCurrency(displayValue)}</>;
}

export function TaxSummary() {
  const { taxResult, grossIncome, dependents, insuranceRate } = useTaxStore();

  const handleExportPDF = () => {
    if (taxResult) {
      exportTaxResultToPDF(taxResult, grossIncome, dependents, insuranceRate);
    }
  };

  if (!taxResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tổng Kết Thuế</CardTitle>
          <CardDescription>Nhập thu nhập của bạn để xem kết quả</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Điền thông tin để tính thuế
          </p>
        </CardContent>
      </Card>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Tổng Kết Thuế
              </CardTitle>
              <CardDescription>
                Bảng phân tích thuế hàng tháng
              </CardDescription>
            </div>
            <Button 
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Xuất PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Net Income - Hero */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Thu Nhập Thực Nhận (Lương Net)
                </h3>
              </div>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                <AnimatedCounter value={taxResult.netIncome} />
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Sau khi trừ các khoản giảm trừ và thuế
              </p>
            </div>

            <Separator />

            {/* Breakdown */}
            <div className="space-y-4">
              {/* Gross Income */}
              <motion.div variants={itemVariants} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Thu Nhập Gộp</span>
                </div>
                <span className="text-sm font-semibold">
                  {formatCurrency(taxResult.grossIncome)}
                </span>
              </motion.div>

              {/* Deductions */}
              <motion.div variants={itemVariants} className="space-y-2 pl-4 border-l-2 border-orange-200 dark:border-orange-800">
                <div className="flex justify-between items-center text-orange-700 dark:text-orange-400">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-3 w-3" />
                    <span className="text-sm">Bảo Hiểm</span>
                  </div>
                  <span className="text-sm font-medium">
                    -{formatCurrency(taxResult.insuranceDeduction)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-orange-700 dark:text-orange-400">
                  <span className="text-sm">Giảm Trừ Bản Thân</span>
                  <span className="text-sm font-medium">
                    -{formatCurrency(taxResult.personalDeduction)}
                  </span>
                </div>
                
                {taxResult.dependentDeduction > 0 && (
                  <div className="flex justify-between items-center text-orange-700 dark:text-orange-400">
                    <span className="text-sm">Giảm Trừ Người Phụ Thuộc</span>
                    <span className="text-sm font-medium">
                      -{formatCurrency(taxResult.dependentDeduction)}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Taxable Income */}
              <motion.div variants={itemVariants} className="flex justify-between items-center pt-2 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Thu Nhập Tính Thuế</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Thu nhập chịu thuế sau các khoản giảm trừ</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(taxResult.taxableIncome)}
                </span>
              </motion.div>

              {/* Tax */}
              <motion.div variants={itemVariants} className="flex justify-between items-center bg-red-50 dark:bg-red-950 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium">Thuế TNCN</span>
                </div>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  -{formatCurrency(taxResult.totalTax)}
                </span>
              </motion.div>

              {/* Effective Rate */}
              <motion.div variants={itemVariants} className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Thuế Suất Hiệu Dụng</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Tỷ lệ thuế trung bình trên thu nhập gộp</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {formatPercentage(taxResult.effectiveRate)}
                </span>
              </motion.div>
            </div>

            <Separator />

            {/* Yearly Projection */}
            <motion.div variants={itemVariants} className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Dự Kiến Cả Năm (×12)</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tổng Thu Nhập</p>
                  <p className="font-semibold">{formatCurrency(taxResult.grossIncome * 12)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Thực Nhận</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(taxResult.netIncome * 12)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Thuế</p>
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(taxResult.totalTax * 12)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bảo Hiểm</p>
                  <p className="font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(taxResult.insuranceDeduction * 12)}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
