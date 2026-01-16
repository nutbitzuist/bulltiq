import { Hero } from "@/components/home/hero";
import { MarketOverview } from "@/components/home/market-overview";
import { IndexPreview } from "@/components/home/index-preview";
import { NewsletterForm } from "@/components/home/newsletter-form";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, TrendingUp, Shield } from "lucide-react";

// Features section
const features = [
  {
    icon: TrendingUp,
    title: "ข้อมูลหุ้นครบถ้วน",
    description: "ครอบคลุม S&P 500, NASDAQ 100 และ ETF ยอดนิยมมากกว่า 600 ตัว",
  },
  {
    icon: BookOpen,
    title: "บทวิเคราะห์ภาษาไทย",
    description: "บทวิเคราะห์หุ้นที่เข้าใจง่าย เขียนโดย AI เหมาะสำหรับนักลงทุนไทย",
  },
  {
    icon: Shield,
    title: "ข้อมูลเชื่อถือได้",
    description: "ข้อมูลจากแหล่งที่น่าเชื่อถือ อัปเดตแบบ Real-time",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Market Overview */}
      <MarketOverview />

      {/* Index Preview */}
      <IndexPreview />

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            ทำไมต้อง{" "}
            <span className="bg-primary px-2 py-1 border-2 border-black shadow-brutal-sm">
              Bulltiq
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary border-3 border-black shadow-brutal-sm mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ETF Section */}
      <section className="py-12 bg-surface border-y-3 border-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="bg-accent-blue text-white px-3 py-1 border-2 border-black">📦</span>
                ETF ยอดนิยม
              </h2>
              <p className="text-text-secondary mt-1">
                กองทุน ETF ที่ได้รับความนิยมสูงสุดสำหรับนักลงทุนรายย่อย
              </p>
            </div>
            <Link href="/etf">
              <Button variant="outline">
                ดูทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["SPY", "QQQ", "VOO", "VTI", "IVV"].map((ticker) => (
              <Link
                key={ticker}
                href={`/etf/${ticker}`}
                className="bg-white border-3 border-black p-4 text-center shadow-brutal-sm hover:shadow-brutal-md hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <div className="font-bold text-xl font-display">{ticker}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterForm />

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            เริ่มต้นศึกษาหุ้นอเมริกาวันนี้
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            เข้าถึงข้อมูลหุ้นมากกว่า 600 ตัว พร้อมบทวิเคราะห์ภาษาไทยที่เข้าใจง่าย
            ฟรีไม่มีค่าใช้จ่าย
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/stocks/sp500">
              <Button
                variant="primary"
                size="lg"
                className="bg-primary text-black"
              >
                เริ่มต้นใช้งาน
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
