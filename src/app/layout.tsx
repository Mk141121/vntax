import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tính Thuế Thu Nhập Cá Nhân Việt Nam 2025",
  description: "Tính thuế thu nhập cá nhân (TNCN) Việt Nam năm 2025. Tính toán chính xác, tức thì với các bậc thuế lũy tiến, giảm trừ và bảo hiểm.",
  keywords: ["Việt Nam", "thuế", "máy tính thuế", "thuế thu nhập", "TNCN", "2025", "giảm trừ", "thuế lũy tiến"],
  authors: [{ name: "Máy Tính Thuế Việt Nam" }],
  openGraph: {
    title: "Tính Thuế Thu Nhập Cá Nhân Việt Nam 2025",
    description: "Tính thuế thu nhập cá nhân Việt Nam chính xác và tức thì",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
