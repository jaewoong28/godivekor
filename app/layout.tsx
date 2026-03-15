import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "GoDiveKor | 스쿠버 다이빙 교육 & 투어",
  description:
    "전문 스쿠버 다이빙 교육과 투어를 제공합니다. PADI 인증 교육, 국내외 다이빙 투어 일정을 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
