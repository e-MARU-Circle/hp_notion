import type { Metadata } from "next";
import { Inter, Gothic_A1 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Google Fontsの読み込み設定
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const gothicA1 = Gothic_A1({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-gothic-a1",
});

export const metadata: Metadata = {
  title: "ABOJC | 米国矯正歯科医会ジャーナルクラブ",
  description: "ABOJCは、米国矯正歯科医会（American Board of Orthodontics）が指定する文献を探求するジャーナルクラブです。科学的根拠に基づいた確かな知見を専門家や一般の方々へ発信します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${gothicA1.variable}`}>
      <body className={`bg-white text-stone-900`}>
        <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}