"use client";

import { motion } from 'framer-motion';
import { Calculator, Github, Info } from 'lucide-react';
import { IncomeForm } from '@/components/form/IncomeForm';
import { DeductionForm } from '@/components/form/DeductionForm';
import { TaxSummary } from '@/components/result/TaxSummary';
import { TaxBreakdownTable } from '@/components/result/TaxBreakdownTable';
import { TaxChart } from '@/components/result/TaxChart';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">🇻🇳 THUẾ THU NHẬP CÁ NHÂN</h1>
                <p className="text-xs text-muted-foreground">Thuế Thu Nhập Cá Nhân 2025</p>
              </div>
            </motion.div>
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </motion.a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Tính Thuế Thu Nhập Cá Nhân Việt Nam (2025)
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Cách tính này sử dụng bảng thuế lũy tiến từng phần chính thức và mức giảm trừ hiện hành. 
                    Tất cả tính toán được thực hiện tức thì khi bạn nhập - không cần nhấn nút!
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded">Bản thân: 11 triệu/tháng</span>
                    <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded">Người phụ thuộc: 4,4 triệu/tháng</span>
                    <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded">Bảo hiểm: 10,5% (mặc định)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input Forms */}
          <div className="space-y-6">
            <IncomeForm />
            <DeductionForm />
            
            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-muted-foreground text-center p-4 bg-muted/30 rounded-lg"
            >
              <p>💡 Tất cả tính toán cập nhật tức thì</p>
              <p className="mt-1">Dựa trên Luật Thuế TNCN Việt Nam năm 2025</p>
            </motion.div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <TaxSummary />
          </div>
        </div>

        {/* Full Width - Charts and Breakdown */}
        <div className="mt-8 space-y-8">
          <Separator />
          
          <TaxBreakdownTable />
          
          <TaxChart />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 py-8 text-center text-sm text-muted-foreground border-t"
        >
          <p className="mb-2">
            © 2025 Tính Thuế Thu Nhập Cá Nhân Việt Nam
          </p>
          <p className="text-xs">
            Tính toán này chỉ mang tính chất tham khảo. 
            Vui lòng tham khảo ý kiến chuyên gia thuế để có tư vấn chính thức.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <a href="#" className="hover:text-foreground transition-colors">
              Giới thiệu
            </a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Bảo mật
            </a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Điều khoản
            </a>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
