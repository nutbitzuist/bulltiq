import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black text-white border-t-4 border-primary">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="bg-primary px-2 py-1 border-2 border-white text-black font-bold text-xl">
                                BULL
                            </span>
                            <span className="text-xl font-bold text-white">TIQ</span>
                        </Link>
                        <p className="text-white/80 max-w-md">
                            ศูนย์รวมข้อมูลหุ้นอเมริกาสำหรับนักลงทุนไทย
                            วิเคราะห์หุ้น S&P 500, NASDAQ 100 และ ETF ยอดนิยม
                            พร้อมบทวิเคราะห์ภาษาไทย
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-primary">ลิงก์ด่วน</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/stocks/sp500" className="text-white/80 hover:text-primary transition-colors">
                                    หุ้น S&P 500
                                </Link>
                            </li>
                            <li>
                                <Link href="/stocks/nasdaq100" className="text-white/80 hover:text-primary transition-colors">
                                    หุ้น NASDAQ 100
                                </Link>
                            </li>
                            <li>
                                <Link href="/etf" className="text-white/80 hover:text-primary transition-colors">
                                    ETF ยอดนิยม
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-white/80 hover:text-primary transition-colors">
                                    บทความ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-primary">เกี่ยวกับ</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-white/80 hover:text-primary transition-colors">
                                    เกี่ยวกับเรา
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-white/80 hover:text-primary transition-colors">
                                    นโยบายความเป็นส่วนตัว
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-white/80 hover:text-primary transition-colors">
                                    ข้อกำหนดการใช้งาน
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 pt-8 border-t border-white/20">
                    <p className="text-white/60 text-sm">
                        ⚠️ ข้อมูลในเว็บไซต์นี้มีไว้เพื่อการศึกษาเท่านั้น ไม่ถือเป็นคำแนะนำในการลงทุน
                        การลงทุนมีความเสี่ยง ผู้ลงทุนควรศึกษาข้อมูลก่อนตัดสินใจลงทุน
                    </p>
                </div>

                {/* Copyright */}
                <div className="mt-6 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/60 text-sm">
                        © 2026 Bulltiq. สงวนลิขสิทธิ์
                    </p>
                    <p className="text-white/60 text-sm">
                        สร้างด้วย ❤️ สำหรับนักลงทุนไทย
                    </p>
                </div>
            </div>
        </footer>
    );
}
