import type { Metadata } from "next";
import { Inter, Gothic_A1 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";

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

const SITE_URL = 'https://abojc.vercel.app';
const SITE_TITLE = 'ABOJC | 矯正歯科の科学的知見と解釈を発信するグループ';
const SITE_DESCRIPTION = 'ABOJCは、American Board of Orthodonticsが指定する文献を探求するジャーナルクラブです。科学的根拠に基づいた確かな知見を専門家や一般の方々へ発信します。';

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: '%s | ABOJC',
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'ABOJC',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${gothicA1.variable}`}>
      <body className={`bg-white text-stone-900`}>
        <OrganizationJsonLd />
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