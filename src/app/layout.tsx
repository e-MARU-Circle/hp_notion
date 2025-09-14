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
  title: "ABOJC 2025",
  description: "The American Board of Orthodontics Japan Chapter (ABOJC) is a distinguished group of certified orthodontists dedicated to the highest standards of practice and patient care.",
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