import type { Metadata } from "next";
import { Tajawal, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import "@xyflow/react/dist/style.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "منصة ألف 5.3 التفاعلية - الإصدار المرئي الاحترافي",
  description: "محرر لغة ألف التفاعلي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${notoKufi.variable} antialiased w-full h-full overflow-hidden`}
    >
      <body className="w-full h-full overflow-hidden font-tajawal bg-slate-900 text-slate-200">{children}</body>
    </html>
  );
}
