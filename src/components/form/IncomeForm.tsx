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
  const { grossIncome, dependents, setGrossIncome, setDependents } = useTaxStore();
  const [incomeDisplay, setIncomeDisplay] = useState(formatNumber(grossIncome));
  const [dependentsDisplay, setDependentsDisplay] = useState(dependents.toString());

  // Update display when store changes from other sources
  useEffect(() => {
    setIncomeDisplay(formatNumber(grossIncome));
  }, [grossIncome]);

  useEffect(() => {
    setDependentsDisplay(dependents.toString());
  }, [dependents]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setIncomeDisplay('0');
      setGrossIncome(0);
      return;
    }
    const numValue = parseInt(value, 10);
    setIncomeDisplay(formatNumber(numValue));
    setGrossIncome(numValue);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Thông Tin Thu Nhập
          </CardTitle>
          <CardDescription>
            Nhập thu nhập gộp hàng tháng và số người phụ thuộc
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gross Income */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="grossIncome">Thu Nhập Gộp (Hàng tháng)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Tổng thu nhập hàng tháng của bạn trước khi trừ bất kỳ khoản nào</p>
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
                className="pr-12 text-lg font-semibold"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                VND
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng thu nhập hàng tháng trước khi trừ các khoản
            </p>
          </div>

          {/* Dependents */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="dependents">Số Người Phụ Thuộc</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Số người phụ thuộc (vợ/chồng, con cái, cha mẹ)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="dependents"
              type="text"
              value={dependentsDisplay}
              onChange={handleDependentsChange}
              className="text-lg font-semibold"
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Vợ/chồng, con cái, cha mẹ phụ thuộc về mặt tài chính
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
