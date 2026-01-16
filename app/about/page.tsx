import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Target,
    Users,
    BookOpen,
    TrendingUp,
    Mail
} from "lucide-react";

export const metadata: Metadata = {
    title: "เกี่ยวกับเรา | Bulltiq - ศูนย์รวมข้อมูลหุ้นอเมริกาสำหรับคนไทย",
    description: "Bulltiq คือแพลตฟอร์มข้อมูลหุ้นสหรัฐฯ ที่ออกแบบมาเพื่อนักลงทุนไทย พร้อมบทวิเคราะห์ภาษาไทยที่เข้าใจง่าย ครอบคลุม S&P 500, NASDAQ 100 และ ETF ยอดนิยม",
    openGraph: {
        title: "เกี่ยวกับเรา | Bulltiq",
        description: "ศูนย์รวมข้อมูลหุ้นอเมริกาสำหรับนักลงทุนไทย",
        type: "website",
    },
};

const values = [
    {
        icon: Target,
        title: "ข้อมูลที่แม่นยำ",
        description: "เราให้ความสำคัญกับความถูกต้องของข้อมูล โดยดึงข้อมูลจากแหล่งที่เชื่อถือได้",
    },
    {
        icon: Users,
        title: "เข้าใจง่าย",
        description: "บทวิเคราะห์เขียนเป็นภาษาไทยที่เข้าใจง่าย เหมาะสำหรับนักลงทุนทุกระดับ",
    },
    {
        icon: BookOpen,
        title: "ให้ความรู้",
        description: "มากกว่าแค่ข้อมูล เราช่วยให้คุณเข้าใจธุรกิจและการลงทุนอย่างแท้จริง",
    },
    {
        icon: TrendingUp,
        title: "อัปเดตทันเหตุการณ์",
        description: "ข้อมูลอัปเดตต่อเนื่อง ให้คุณไม่พลาดทุกการเคลื่อนไหวของตลาด",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-primary border-b-3 border-black">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold font-display mb-6">
                            เกี่ยวกับ{" "}
                            <span className="bg-black text-primary px-3 py-1">Bulltiq</span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                            เราเชื่อว่าคนไทยทุกคนควรมีโอกาสเข้าถึงข้อมูลการลงทุนที่มีคุณภาพ
                            โดยเฉพาะตลาดหุ้นสหรัฐฯ ที่เป็นตลาดที่ใหญ่ที่สุดในโลก
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="p-8 md:p-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                                พันธกิจของเรา
                            </h2>
                            <div className="space-y-4 text-lg leading-relaxed">
                                <p>
                                    <strong>Bulltiq</strong> ถูกสร้างขึ้นมาเพื่อเป็นสะพานเชื่อมให้นักลงทุนไทย
                                    สามารถเข้าถึงข้อมูลหุ้นสหรัฐฯ ได้อย่างง่ายดาย ไม่ว่าคุณจะเป็นมือใหม่
                                    ที่เพิ่งเริ่มสนใจการลงทุน หรือนักลงทุนที่มีประสบการณ์
                                </p>
                                <p>
                                    เราเข้าใจว่าอุปสรรคสำคัญของนักลงทุนไทยในการลงทุนหุ้นต่างประเทศ
                                    คือภาษาและความซับซ้อนของข้อมูล ดังนั้นเราจึงมุ่งมั่นที่จะนำเสนอข้อมูล
                                    ในรูปแบบที่เข้าใจง่าย พร้อมบทวิเคราะห์ภาษาไทยที่ครอบคลุม
                                </p>
                                <p>
                                    ปัจจุบัน Bulltiq ครอบคลุมหุ้นในดัชนี <strong>S&P 500</strong>,
                                    <strong> NASDAQ 100</strong> และ <strong>ETF ยอดนิยม</strong> มากกว่า 700 ตัว
                                    พร้อมบทวิเคราะห์เชิงลึกที่จะช่วยให้คุณตัดสินใจลงทุนได้ดีขึ้น
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-surface border-y-3 border-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                        คุณค่าที่เรายึดมั่น
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <Card key={value.title} className="text-center p-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary border-3 border-black shadow-brutal-sm mb-4">
                                    <value.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-text-secondary">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                            สิ่งที่เรานำเสนอ
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <span className="bg-accent-blue text-white px-2 py-1 text-sm">📊</span>
                                    ข้อมูลหุ้น S&P 500
                                </h3>
                                <p className="text-text-secondary">
                                    ครอบคลุมหุ้น 500 บริษัทที่ใหญ่ที่สุดในสหรัฐฯ พร้อมข้อมูลราคา,
                                    ผลประกอบการ, และบทวิเคราะห์ภาษาไทย
                                </p>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <span className="bg-accent-green text-white px-2 py-1 text-sm">💻</span>
                                    ข้อมูลหุ้น NASDAQ 100
                                </h3>
                                <p className="text-text-secondary">
                                    หุ้นเทคโนโลยีและนวัตกรรมชั้นนำ 100 บริษัท เช่น Apple, Microsoft,
                                    NVIDIA, Tesla และอื่นๆ
                                </p>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <span className="bg-accent-purple text-white px-2 py-1 text-sm">📦</span>
                                    ETF ยอดนิยม
                                </h3>
                                <p className="text-text-secondary">
                                    กองทุน ETF ที่ได้รับความนิยมสูงสุด สำหรับการกระจายความเสี่ยง
                                    และลงทุนในภาพรวมตลาด
                                </p>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <span className="bg-accent-orange text-white px-2 py-1 text-sm">📝</span>
                                    บทวิเคราะห์ภาษาไทย
                                </h3>
                                <p className="text-text-secondary">
                                    บทวิเคราะห์เชิงลึกที่เขียนเป็นภาษาไทย เข้าใจง่าย
                                    เหมาะสำหรับนักลงทุนไทยทุกระดับ
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-black text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">ติดต่อเรา</h2>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                        มีคำถาม ข้อเสนอแนะ หรืออยากร่วมงานกับเรา? ติดต่อได้ที่
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="mailto:contact@bulltiq.com"
                            className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 border-3 border-white font-bold hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all"
                        >
                            <Mail className="w-5 h-5" />
                            contact@bulltiq.com
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-surface border-t-3 border-black">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        พร้อมเริ่มต้นแล้วหรือยัง?
                    </h2>
                    <p className="text-text-secondary mb-8 max-w-xl mx-auto">
                        เริ่มต้นศึกษาหุ้นอเมริกาวันนี้ ฟรี ไม่มีค่าใช้จ่าย
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/stocks/sp500">
                            <Button variant="primary" size="lg">
                                หุ้น S&P 500
                            </Button>
                        </Link>
                        <Link href="/stocks/nasdaq100">
                            <Button variant="outline" size="lg">
                                หุ้น NASDAQ 100
                            </Button>
                        </Link>
                        <Link href="/etf">
                            <Button variant="outline" size="lg">
                                กองทุน ETF
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
