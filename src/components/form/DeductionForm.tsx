"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Info } from 'lucide-react';
import { useTaxStore } from '@/store/tax-store';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { TAX_DESCRIPTIONS, DEFAULT_INSURANCE_RATES, INSURANCE_RATE_MIN, INSURANCE_RATE_MAX } from '@/lib/tax/rules-2025';
import { formatPercentage } from '@/lib/utils';

export function DeductionForm() {
  const { insuranceRate, setInsuranceRate } = useTaxStore();
  const [rateDisplay, setRateDisplay] = useState(insuranceRate.toString());

  useEffect(() => {
    setRateDisplay(insuranceRate.toFixed(1));
  }, [insuranceRate]);

  const handleSliderChange = (value: number[]) => {
    const newRate = value[0];
    setInsuranceRate(newRate);
    setRateDisplay(newRate.toFixed(1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setRateDisplay(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= INSURANCE_RATE_MIN && numValue <= INSURANCE_RATE_MAX) {
      setInsuranceRate(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(rateDisplay);
    if (isNaN(numValue) || numValue < INSURANCE_RATE_MIN) {
      setInsuranceRate(INSURANCE_RATE_MIN);
      setRateDisplay(INSURANCE_RATE_MIN.toFixed(1));
    } else if (numValue > INSURANCE_RATE_MAX) {
      setInsuranceRate(INSURANCE_RATE_MAX);
      setRateDisplay(INSURANCE_RATE_MAX.toFixed(1));
    } else {
      setRateDisplay(numValue.toFixed(1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-primary opacity-70" />
            Giảm Trừ & Bảo Hiểm
          </CardTitle>
          <CardDescription className="text-xs">
            Điều chỉnh tỷ lệ bảo hiểm bắt buộc
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Insurance Rate Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="insuranceRate" className="text-xs">Tỷ Lệ Bảo Hiểm</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help opacity-50" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">BHXH (8%) + BHYT (1,5%) + BHTN (1%) = 10,5%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="insuranceRateInput"
                  type="text"
                  value={rateDisplay}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="w-20 text-right font-semibold"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            
            <Slider
              id="insuranceRate"
              min={INSURANCE_RATE_MIN}
              max={INSURANCE_RATE_MAX}
              step={0.5}
              value={[insuranceRate]}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Cơ cấu mặc định (tổng {formatPercentage(DEFAULT_INSURANCE_RATES.total)}):</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Bảo hiểm xã hội (BHXH): {formatPercentage(DEFAULT_INSURANCE_RATES.social)}</li>
                <li>Bảo hiểm y tế (BHYT): {formatPercentage(DEFAULT_INSURANCE_RATES.health)}</li>
                <li>Bảo hiểm thất nghiệp (BHTN): {formatPercentage(DEFAULT_INSURANCE_RATES.unemployment)}</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Fixed Deductions Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Các Khoản Giảm Trừ Cố Định (2025)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Giảm Trừ Bản Thân</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Giảm trữ bản thân: 15,5 triệu đồng/tháng</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground">15.500.000 đ/tháng</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Giảm Trừ Người Phụ Thuộc</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Mỗi người phụ thuộc: 6,2 triệu đồng/tháng</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground">6.200.000 đ/người/tháng</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
