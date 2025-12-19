"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Info } from 'lucide-react';
import { useTaxStore } from '@/store/tax-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/utils';

const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export function MonthlyIncomeTable() {
  const { monthlyData, updateMonthData, copyFromPreviousMonth } = useTaxStore();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const handleGrossIncomeChange = (month: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    const numValue = cleanValue === '' ? 0 : parseInt(cleanValue, 10);
    updateMonthData(month, { grossIncome: numValue });
  };

  const handleInsuranceSalaryChange = (month: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    const numValue = cleanValue === '' ? 0 : parseInt(cleanValue, 10);
    updateMonthData(month, { insuranceSalary: numValue });
  };

  const handleNoteChange = (month: number, value: string) => {
    updateMonthData(month, { note: value });
  };

  const handleCopyFromPrevious = (month: number) => {
    if (month > 1) {
      copyFromPreviousMonth(month);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Thu Nhập Theo Tháng</CardTitle>
              <CardDescription className="text-xs">
                Nhập thu nhập cho từng tháng trong năm
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Để trống = 0. Dùng nút &ldquo;Sao chép&rdquo; để áp dụng tháng trước cho các tháng còn lại.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground pb-2 border-b border-border/50">
              <div className="col-span-2">Tháng</div>
              <div className="col-span-4">Tổng Thu Nhập</div>
              <div className="col-span-4">Lương Đóng BH</div>
              <div className="col-span-2">Thao tác</div>
            </div>

            {/* Rows */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {monthlyData.map((data) => (
                <div
                  key={data.month}
                  className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg border ${
                    selectedMonth === data.month
                      ? 'border-primary bg-primary/5'
                      : 'border-border/30'
                  }`}
                  onClick={() => setSelectedMonth(data.month)}
                >
                  {/* Month */}
                  <div className="col-span-2 text-sm font-medium">
                    {MONTH_NAMES[data.month - 1]}
                  </div>

                  {/* Gross Income */}
                  <div className="col-span-4">
                    <Input
                      type="text"
                      value={data.grossIncome > 0 ? formatNumber(data.grossIncome) : ''}
                      onChange={(e) => handleGrossIncomeChange(data.month, e.target.value)}
                      placeholder="0"
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Insurance Salary */}
                  <div className="col-span-4">
                    <Input
                      type="text"
                      value={data.insuranceSalary > 0 ? formatNumber(data.insuranceSalary) : ''}
                      onChange={(e) => handleInsuranceSalaryChange(data.month, e.target.value)}
                      placeholder="0"
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    {data.month > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyFromPrevious(data.month);
                        }}
                        className="h-8 w-full p-0"
                        title="Sao chép từ tháng trước"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Fill Hint */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                💡 Nhấn nút <Copy className="h-3 w-3 inline" /> để sao chép thu nhập từ tháng trước sang các tháng còn lại
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
