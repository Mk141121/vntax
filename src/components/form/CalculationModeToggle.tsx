"use client";

import { motion } from 'framer-motion';
import { useTaxStore } from '@/store/tax-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function CalculationModeToggle() {
  const { calculationMode, setCalculationMode } = useTaxStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Chế Độ Tính Thuế</CardTitle>
          <CardDescription className="text-xs">
            Chọn cách tính thuế phù hợp với tình huống của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCalculationMode('fixed')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationMode === 'fixed'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border/60'
              }`}
            >
              <div className="text-left">
                <p className={`font-semibold text-sm mb-1 ${
                  calculationMode === 'fixed' ? 'text-primary' : 'text-foreground'
                }`}>
                  Thu Nhập Cố Định
                </p>
                <p className="text-xs text-muted-foreground">
                  Lương cố định hàng tháng
                </p>
              </div>
            </button>

            <button
              onClick={() => setCalculationMode('monthly')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationMode === 'monthly'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border/60'
              }`}
            >
              <div className="text-left">
                <p className={`font-semibold text-sm mb-1 ${
                  calculationMode === 'monthly' ? 'text-primary' : 'text-foreground'
                }`}>
                  Thu Nhập Theo Từng Tháng
                </p>
                <p className="text-xs text-muted-foreground">
                  Thu nhập thay đổi mỗi tháng
                </p>
              </div>
            </button>
          </div>

          {calculationMode === 'monthly' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            >
              <p className="text-xs text-blue-400">
                💡 Phù hợp cho freelancer, người có thưởng, hoặc thu nhập không đều
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
