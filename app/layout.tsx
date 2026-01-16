import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-thai",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bulltiq - ศูนย์รวมข้อมูลหุ้นอเมริกาสำหรับนักลงทุนไทย",
    template: "%s | Bulltiq",
  },
  description:
    "แพลตฟอร์มวิเคราะห์หุ้นอเมริกาภาษาไทย ครอบคลุม S&P 500, NASDAQ 100 และ ETF ยอดนิยม พร้อมบทวิเคราะห์ภาษาไทยโดย AI",
  keywords: [
    "หุ้นอเมริกา",
    "วิเคราะห์หุ้น",
    "S&P 500",
    "NASDAQ",
    "ETF",
    "ลงทุนต่างประเทศ",
    "หุ้นสหรัฐ",
  ],
  authors: [{ name: "Bulltiq" }],
  creator: "Bulltiq",
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://bulltiq.com",
    siteName: "Bulltiq",
    title: "Bulltiq - ศูนย์รวมข้อมูลหุ้นอเมริกาสำหรับนักลงทุนไทย",
    description:
      "แพลตฟอร์มวิเคราะห์หุ้นอเมริกาภาษาไทย ครอบคลุม S&P 500, NASDAQ 100 และ ETF ยอดนิยม",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulltiq - ศูนย์รวมข้อมูลหุ้นอเมริกาสำหรับนักลงทุนไทย",
    description:
      "แพลตฟอร์มวิเคราะห์หุ้นอเมริกาภาษาไทย ครอบคลุม S&P 500, NASDAQ 100 และ ETF ยอดนิยม",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${ibmPlexThai.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        <script defer src="https://cloud.umami.is/script.js" data-website-id="bc22d971-02f1-4e02-bc76-b1269f863bde"></script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
