"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Info } from 'lucide-react';
import { useTaxStore } from '@/store/tax-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TAX_DESCRIPTIONS } from '@/lib/tax/rules-2025';
import { formatNumber, parseCurrency } from '@/lib/utils';

export function IncomeForm() {
  const { grossIncome, insuranceSalary, dependents, setGrossIncome, setInsuranceSalary, setDependents } = useTaxStore();
  const [incomeDisplay, setIncomeDisplay] = useState(formatNumber(grossIncome));
  const [insuranceSalaryDisplay, setInsuranceSalaryDisplay] = useState(formatNumber(insuranceSalary));
  const [dependentsDisplay, setDependentsDisplay] = useState(dependents.toString());

  // Update display when store changes from other sources
  useEffect(() => {
    setIncomeDisplay(formatNumber(grossIncome));
  }, [grossIncome]);

  useEffect(() => {
    setInsuranceSalaryDisplay(formatNumber(insuranceSalary));
  }, [insuranceSalary]);

  useEffect(() => {
    setDependentsDisplay(dependents.toString());
  }, [dependents]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setIncomeDisplay('0');
      setGrossIncome(0);
      // Tự động cập nhật insurance salary nếu nó bằng gross income cũ
      if (insuranceSalary === grossIncome) {
        setInsuranceSalaryDisplay('0');
        setInsuranceSalary(0);
      }
      return;
    }
    const numValue = parseInt(value, 10);
    setIncomeDisplay(formatNumber(numValue));
    setGrossIncome(numValue);
    // Tự động cập nhật insurance salary nếu nó bằng gross income cũ
    if (insuranceSalary === grossIncome) {
      setInsuranceSalaryDisplay(formatNumber(numValue));
      setInsuranceSalary(numValue);
    }
  };

  const handleInsuranceSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setInsuranceSalaryDisplay('0');
      setInsuranceSalary(0);
      return;
    }
    const numValue = parseInt(value, 10);
    setInsuranceSalaryDisplay(formatNumber(numValue));
    setInsuranceSalary(numValue);
  };

  const handleDependentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setDependentsDisplay('0');
      setDependents(0);
      return;
    }
    const numValue = parseInt(value, 10);
    setDependentsDisplay(numValue.toString());
    setDependents(numValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4 text-primary opacity-70" />
            Thông Tin Thu Nhập
          </CardTitle>
          <CardDescription className="text-xs">
            Nhập thu nhập gộp hàng tháng và số người phụ thuộc
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gross Income */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="grossIncome" className="text-xs">Thu Nhập Gộp (Hàng tháng)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help opacity-50" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">Tổng thu nhập hàng tháng trước khi trừ bất kỳ khoản nào</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                id="grossIncome"
                type="text"
                value={incomeDisplay}
                onChange={handleIncomeChange}
                className="pr-12 text-base font-semibold h-10"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-70">
                VND
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground opacity-70">
              Tổng thu nhập hàng tháng trước khi trừ các khoản
            </p>
          </div>

          {/* Insurance Salary */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="insuranceSalary" className="text-xs">Mức Lương Đóng Bảo Hiểm (theo HĐLĐ)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help opacity-50" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs font-semibold mb-1">Là mức lương ghi trong hợp đồng lao động</p>
                    <p className="text-xs">Dùng để tính BHXH, BHYT, BHTN. KHÔNG PHẢI tổng thu nhập thực nhận.</p>
                    <p className="text-xs mt-1 text-yellow-400">⚠️ Mặc định bằng thu nhập gộp, có thể chỉnh sửa.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                id="insuranceSalary"
                type="text"
                value={insuranceSalaryDisplay}
                onChange={handleInsuranceSalaryChange}
                className="pr-12 text-base font-semibold h-10"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-70">
                VND
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground opacity-70">
              Mức lương theo hợp đồng làm căn cứ đóng BHXH, BHYT, BHTN
            </p>
            {insuranceSalary > grossIncome && (
              <p className="text-[10px] text-yellow-600 dark:text-yellow-500">
                ⚠️ Lưu ý: Mức lương đóng BH cao hơn thu nhập gộp
              </p>
            )}
          </div>

          {/* Dependents */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="dependents" className="text-xs">Số Người Phụ Thuộc</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help opacity-50" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">Số người phụ thuộc (vợ/chồng, con cái, cha mẹ)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="dependents"
              type="text"
              value={dependentsDisplay}
              onChange={handleDependentsChange}
              className="text-base font-semibold h-10"
              placeholder="0"
            />
            <p className="text-[10px] text-muted-foreground opacity-70">
              Vợ/chồng, con cái, cha mẹ phụ thuộc về mặt tài chính
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
