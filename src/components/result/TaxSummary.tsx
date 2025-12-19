"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Wallet, Shield, TrendingDown, DollarSign, Info, Download, Receipt, PieChart as PieChartIcon, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useTaxStore } from '@/store/tax-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { exportTaxResultToPDFSimple } from '@/lib/pdf-export-simple';

// Fintech color palette - rõ ràng và dễ phân biệt
const FINTECH_COLORS = {
  netIncome: '#10b981',      // Emerald green - Thực nhận (positive)
  tax: '#f59e0b',            // Amber - Thuế (warning)
  insurance: '#3b82f6',      // Blue - Bảo hiểm (info)
};

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

// Stat Card Component with color coding
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  tooltip,
  colorScheme = 'default'
}: { 
  title: string; 
  value: number; 
  icon: any; 
  tooltip?: string;
  colorScheme?: 'default' | 'success' | 'warning' | 'info';
}) {
  const colorClasses = {
    default: {
      card: 'border-border/50',
      iconBg: 'bg-muted/50',
      iconColor: 'text-muted-foreground',
      text: 'text-foreground'
    },
    success: {
      card: 'border-emerald-500/30 bg-emerald-500/5',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-500',
      text: 'text-emerald-500'
    },
    warning: {
      card: 'border-amber-500/30 bg-amber-500/5',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-500',
      text: 'text-amber-500'
    },
    info: {
      card: 'border-blue-500/30 bg-blue-500/5',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
      text: 'text-blue-500'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className={colors.card}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${colors.iconBg}`}>
              <Icon className={`h-3.5 w-3.5 ${colors.iconColor}`} />
            </div>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help opacity-50" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{title}</p>
        <p className={`text-xl font-bold ${colors.text} break-all`}>
          <AnimatedCounter value={value} />
        </p>
      </CardContent>
    </Card>
  );
}

export function TaxSummary() {
  const { taxResult, yearlyResult, calculationMode, grossIncome, dependents, insuranceRate } = useTaxStore();

  const handleExportPDF = async () => {
    await exportTaxResultToPDFSimple(
      taxResult,
      yearlyResult,
      calculationMode,
      dependents,
      insuranceRate
    );
  };

  // Determine which result to display
  const hasResult = calculationMode === 'fixed' ? taxResult !== null : yearlyResult !== null;
  
  if (!hasResult) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary opacity-70" />
            Tổng Kết Thuế
          </CardTitle>
          <CardDescription>Nhập thu nhập của bạn để xem kết quả</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8 text-sm">
            {calculationMode === 'monthly' 
              ? 'Nhập thu nhập cho ít nhất 1 tháng và nhấn TÍNH TOÁN'
              : 'Điền thông tin để tính thuế'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get data based on mode
  const displayData = calculationMode === 'fixed' && taxResult ? {
    grossIncome: taxResult.grossIncome,
    insuranceSalary: taxResult.insuranceSalary,
    insuranceDeduction: taxResult.insuranceDeduction,
    totalTax: taxResult.totalTax,
    netIncome: taxResult.netIncome,
    effectiveRate: taxResult.effectiveRate,
  } : yearlyResult ? {
    grossIncome: yearlyResult.totalGrossIncome,
    insuranceSalary: yearlyResult.totalGrossIncome, // Yearly không có single insurance salary
    insuranceDeduction: yearlyResult.totalInsuranceDeduction,
    totalTax: yearlyResult.totalTax,
    netIncome: yearlyResult.totalNetIncome,
    effectiveRate: yearlyResult.effectiveRate,
  } : null;

  if (!displayData) return null;

  // Pie chart data - KHÔNG bao gồm Gross Income
  const pieData = [
    { name: 'Thực Nhận', value: displayData.netIncome, color: FINTECH_COLORS.netIncome },
    { name: 'Thuế TNCN', value: displayData.totalTax, color: FINTECH_COLORS.tax },
    { name: 'Bảo Hiểm', value: displayData.insuranceDeduction, color: FINTECH_COLORS.insurance },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      id="tax-summary-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header with PDF export */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="h-5 w-5 text-primary" />
                TỔNG KẾT THUẾ
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Phân tích chi tiết thuế thu nhập cá nhân
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="gap-2 h-9 text-xs border-amber-500/30 hover:bg-amber-500/10"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    CHI TIẾT
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                      <Info className="h-5 w-5 text-primary" />
                      Chi Tiết Cách Tính Thuế
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Phân tích chi tiết cách tính thuế TNCN theo luật Việt Nam 2025-2026
                    </DialogDescription>
                  </DialogHeader>
                  
                  {taxResult && (taxResult as any).explanation && (
                    <div className="space-y-4 mt-4">
                      {(() => {
                        const explanation = (taxResult as any).explanation;
                        return (
                          <>
                            {/* Summary */}
                            <Card className="border-border/50">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                  📊 Tóm Tắt
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <pre className="text-xs whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                                  {explanation.summary}
                                </pre>
                              </CardContent>
                            </Card>

                            {/* Tax Calculation */}
                            <Card className="border-border/50">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                  🧮 Cách Tính Thuế
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <pre className="text-xs whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                                  {explanation.taxCalculation}
                                </pre>
                              </CardContent>
                            </Card>

                            {/* Deductions Explanation */}
                            <Card className="border-border/50">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                  💰 Giảm Trừ
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <pre className="text-xs whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                                  {explanation.deductionsExplanation}
                                </pre>
                              </CardContent>
                            </Card>

                            {/* Insurance Explanation */}
                            <Card className="border-border/50">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                  🛡️ Bảo Hiểm
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <pre className="text-xs whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                                  {explanation.insuranceExplanation}
                                </pre>
                              </CardContent>
                            </Card>

                            {/* Effective Rate */}
                            <Card className="border-border/50">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                  📈 Thuế Suất Hiệu Dụng
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <pre className="text-xs whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                                  {explanation.effectiveRateExplanation}
                                </pre>
                              </CardContent>
                            </Card>

                            {/* Suggestions */}
                            {explanation.suggestions && explanation.suggestions.length > 0 && (
                              <Card className="border-border/50 border-primary/20 bg-primary/5">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    💡 Gợi Ý
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <ul className="space-y-2">
                                    {explanation.suggestions.map((suggestion: string, index: number) => (
                                      <li key={index} className="text-xs text-foreground flex gap-2 leading-relaxed">
                                        <span className="text-primary">•</span>
                                        <span>{suggestion}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={handleExportPDF}
                variant="outline"
                size="sm"
                className="gap-2 h-9 text-xs border-primary/20 hover:bg-primary/10"
              >
                <Download className="h-3.5 w-3.5" />
                Tải PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stat Cards Grid - 2 hàng: 3 cards + 2 cards */}
      <motion.div variants={itemVariants} className="space-y-3">
        {/* Hàng 1: Tổng Thu Nhập, Lương Đóng BH, Bảo Hiểm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard
            title="Tổng Thu Nhập"
            value={displayData.grossIncome}
            icon={DollarSign}
            tooltip={calculationMode === 'monthly' 
              ? "Tổng thu nhập cả năm (12 tháng)" 
              : "Tổng thu nhập hàng tháng trước các khoản khấu trừ"
            }
            colorScheme="default"
          />
          <StatCard
            title="Lương Đóng BH"
            value={displayData.insuranceSalary}
            icon={Shield}
            tooltip={calculationMode === 'monthly'
              ? "Tổng lương đóng bảo hiểm cả năm"
              : "Mức lương theo hợp đồng làm căn cứ đóng BHXH, BHYT, BHTN"
            }
            colorScheme="default"
          />
          <StatCard
            title="Bảo Hiểm"
            value={displayData.insuranceDeduction}
            icon={Shield}
            tooltip={calculationMode === 'monthly'
              ? `Tổng bảo hiểm cả năm (${insuranceRate}%)`
              : `BHXH + BHYT + BHTN = ${insuranceRate}% × ${formatCurrency(displayData.insuranceSalary)}`
            }
            colorScheme="info"
          />
        </div>
        
        {/* Hàng 2: Thuế TNCN, Thực Nhận (center aligned) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:max-w-2xl md:mx-auto">
          <StatCard
            title="Thuế TNCN"
            value={displayData.totalTax}
            icon={TrendingDown}
            tooltip={calculationMode === 'monthly'
              ? "Tổng thuế TNCN phải nộp cả năm"
              : "Thuế thu nhập cá nhân theo bảng lũy tiến từng phần"
            }
            colorScheme="warning"
          />
          <StatCard
            title="Thực Nhận"
            value={displayData.netIncome}
            icon={Wallet}
            tooltip={calculationMode === 'monthly'
              ? "Tổng thu nhập thực nhận cả năm"
              : "Thu nhập thực tế nhận được sau khi trừ bảo hiểm và thuế"
            }
            colorScheme="success"
          />
        </div>
      </motion.div>

      {/* Pie Chart - Phân bổ thu nhập */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon className="h-4 w-4 text-primary" />
              Tiền Của Bạn Đi Đâu?
            </CardTitle>
            <CardDescription className="text-xs">
              Phân bổ thu nhập gộp thành các khoản
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={{
                    stroke: 'hsl(var(--muted-foreground))',
                    strokeWidth: 1
                  }}
                  label={({ name, value, percent }) => {
                    return `${name}: ${(percent * 100).toFixed(1)}%`;
                  }}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--background))" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const percentage = ((data.value as number) / displayData.grossIncome * 100).toFixed(1);
                      return (
                        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                          <p className="font-semibold text-sm mb-1">{data.name}</p>
                          <p className="text-sm font-bold" style={{ color: data.payload.color }}>
                            {formatCurrency(data.value as number)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {percentage}% của tổng thu nhập
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend với màu sắc rõ ràng */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {pieData.map((item) => (
                <div 
                  key={item.name} 
                  className="flex items-start gap-3 p-3 rounded-lg border"
                  style={{ 
                    borderColor: item.color,
                    backgroundColor: `${item.color}10`
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded flex-shrink-0 mt-0.5 shadow-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-1" style={{ color: item.color }}>
                      {item.name}
                    </p>
                    <p className="text-base font-bold truncate" style={{ color: item.color }}>
                      {formatCurrency(item.value)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((item.value / displayData.grossIncome) * 100).toFixed(1)}% của tổng
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Breakdown Detail - Only for fixed mode */}
      {calculationMode === 'fixed' && taxResult && (
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Chi Tiết Tính Thuế</CardTitle>
              <CardDescription className="text-xs">
                Quy trình tính toán từ thu nhập gộp đến thực nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2.5">

                {/* Gross Income */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">Tổng Thu Nhập</span>
                  <span className="text-sm font-bold">
                    {formatCurrency(taxResult.grossIncome)}
                  </span>
                </div>

              <Separator className="opacity-50" />

              {/* Deductions */}
              <div className="space-y-2 py-2">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-sm flex items-center gap-2">
                    <TrendingDown className="h-3.5 w-3.5 opacity-60" />
                    Bảo Hiểm
                  </span>
                  <span className="text-sm font-medium">
                    -{formatCurrency(taxResult.insuranceDeduction)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-sm">Giảm Trừ Bản Thân</span>
                  <span className="text-sm font-medium">
                    -{formatCurrency(taxResult.personalDeduction)}
                  </span>
                </div>
                
                {taxResult.dependentDeduction > 0 && (
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="text-sm">Giảm Trừ Người Phụ Thuộc ({dependents} người)</span>
                    <span className="text-sm font-medium">
                      -{formatCurrency(taxResult.dependentDeduction)}
                    </span>
                  </div>
                )}
              </div>

              <Separator className="opacity-50" />

              {/* Taxable Income */}
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Thu Nhập Chịu Thuế</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help opacity-50" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Thu nhập sau khi trừ các khoản giảm trừ, dùng để tính thuế lũy tiến</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-semibold">
                  {formatCurrency(taxResult.taxableIncome)}
                </span>
              </div>

              <Separator className="opacity-50" />

              {/* Tax */}
              <div className="flex justify-between items-center py-2">
                <span className="text-sm flex items-center gap-2 text-muted-foreground">
                  <TrendingDown className="h-3.5 w-3.5 opacity-60" />
                  Thuế TNCN
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  -{formatCurrency(taxResult.totalTax)}
                </span>
              </div>

              <Separator className="opacity-50" />

              {/* Net Income - Final result */}
              <div className="flex justify-between items-center py-3 bg-primary/5 -mx-6 px-6 rounded-lg">
                <span className="text-base font-semibold flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  Thực Nhận
                </span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(taxResult.netIncome)}
                </span>
              </div>

              {/* Effective Rate */}
              <div className="flex justify-between items-center pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span>Thuế suất hiệu dụng</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 cursor-help opacity-50" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Tỷ lệ thuế trung bình trên thu nhập gộp</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="font-medium">
                  {formatPercentage(taxResult.effectiveRate)}
                </span>
              </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Yearly Projection - Only for fixed mode */}
      {calculationMode === 'fixed' && taxResult && (
        <motion.div variants={itemVariants}>
        <Card className="border-border/50 border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dự Kiến Cả Năm</CardTitle>
            <CardDescription className="text-xs">
              Ước tính thu nhập và thuế cho 12 tháng
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tổng Thu Nhập</p>
                <p className="text-base font-bold">{formatCurrency(taxResult.grossIncome * 12)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Thực Nhận</p>
                <p className="text-base font-bold text-primary">
                  {formatCurrency(taxResult.netIncome * 12)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Thuế TNCN</p>
                <p className="text-base font-bold">
                  {formatCurrency(taxResult.totalTax * 12)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bảo Hiểm</p>
                <p className="text-base font-bold">
                  {formatCurrency(taxResult.insuranceDeduction * 12)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
