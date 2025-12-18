"use client";

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useTaxStore } from '@/store/tax-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export function TaxBreakdownTable() {
  const { taxResult } = useTaxStore();

  if (!taxResult || taxResult.breakdown.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bảng Phân Tích Thuế Lũy Tiến
          </CardTitle>
          <CardDescription>
            Cách tính thuế theo các bậc thuế
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Bậc</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Khoảng Thu Nhập</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Thuế Suất</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Thu Nhập Tính Thuế</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Thuế</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {taxResult.breakdown.map((item, index) => (
                  <motion.tr
                    key={index}
                    variants={rowVariants}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                        {item.bracket}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs">
                      {formatCurrency(item.from)} - {item.to === Infinity ? '∞' : formatCurrency(item.to)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {formatPercentage(item.rate * 100, 0)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {formatCurrency(item.taxableAmount)}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(item.tax)}
                    </td>
                  </motion.tr>
                ))}
                {/* Total Row */}
                <motion.tr
                  variants={rowVariants}
                  className="bg-muted/30 font-semibold"
                >
                  <td colSpan={3} className="py-3 px-2 text-right">
                    Tổng Thuế:
                  </td>
                  <td className="py-3 px-2 text-right">
                    {formatCurrency(taxResult.taxableIncome)}
                  </td>
                  <td className="py-3 px-2 text-right text-red-600 dark:text-red-400">
                    {formatCurrency(taxResult.totalTax)}
                  </td>
                </motion.tr>
              </motion.tbody>
            </table>
          </div>

          {/* Mobile-friendly cards view */}
          <div className="md:hidden space-y-3 mt-4">
            {taxResult.breakdown.map((item, index) => (
              <motion.div
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="bg-muted/30 p-4 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Bậc {item.bracket}</span>
                  <span className="text-sm font-medium">{formatPercentage(item.rate * 100, 0)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(item.from)} - {item.to === Infinity ? '∞' : formatCurrency(item.to)}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tính thuế:</span>
                  <span className="font-medium">{formatCurrency(item.taxableAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thuế:</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(item.tax)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
