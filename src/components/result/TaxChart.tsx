"use client";

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useTaxStore } from '@/store/tax-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const COLORS = {
  gross: '#3b82f6',      // blue
  insurance: '#f97316',  // orange
  tax: '#ef4444',        // red
  net: '#22c55e'         // green
};

export function TaxChart() {
  const { taxResult } = useTaxStore();

  if (!taxResult) {
    return null;
  }

  // Pie chart data
  const pieData = [
    { name: 'Thu Nhập Thực Nhận', value: taxResult.netIncome, color: COLORS.net },
    { name: 'Bảo Hiểm', value: taxResult.insuranceDeduction, color: COLORS.insurance },
    { name: 'Thuế', value: taxResult.totalTax, color: COLORS.tax },
  ];

  // Bar chart data (Monthly vs Yearly)
  const barData = [
    {
      period: 'Tháng',
      'Thu Nhập Gộp': taxResult.grossIncome,
      'Bảo Hiểm': taxResult.insuranceDeduction,
      'Thuế': taxResult.totalTax,
      'Thực Nhận': taxResult.netIncome,
    },
    {
      period: 'Năm',
      'Thu Nhập Gộp': taxResult.grossIncome * 12,
      'Bảo Hiểm': taxResult.insuranceDeduction * 12,
      'Thuế': taxResult.totalTax * 12,
      'Thực Nhận': taxResult.netIncome * 12,
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3 space-y-1">
          <p className="font-semibold text-sm mb-2">{payload[0].payload.period}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
              <span className="font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Phân Bổ Thu Nhập
          </CardTitle>
          <CardDescription>
            Thu nhập của bạn được phân bổ như thế nào
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend with values */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                  <p className="text-sm font-semibold truncate">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Monthly vs Yearly */}
      <Card>
        <CardHeader>
          <CardTitle>So Sánh Tháng và Năm</CardTitle>
          <CardDescription>
            So sánh số tiền theo tháng và theo năm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="period" 
                className="text-xs"
              />
              <YAxis 
                className="text-xs"
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(0)}M`;
                  }
                  return value.toLocaleString();
                }}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend />
              <Bar 
                dataKey="Thu Nhập Gộp" 
                fill={COLORS.gross} 
                radius={[4, 4, 0, 0]}
                animationBegin={0}
                animationDuration={800}
              />
              <Bar 
                dataKey="Bảo Hiểm" 
                fill={COLORS.insurance} 
                radius={[4, 4, 0, 0]}
                animationBegin={100}
                animationDuration={800}
              />
              <Bar 
                dataKey="Thuế" 
                fill={COLORS.tax} 
                radius={[4, 4, 0, 0]}
                animationBegin={200}
                animationDuration={800}
              />
              <Bar 
                dataKey="Thực Nhận" 
                fill={COLORS.net} 
                radius={[4, 4, 0, 0]}
                animationBegin={300}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
