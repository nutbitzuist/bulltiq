import Link from "next/link";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="bg-background py-16 md:py-24 border-b-3 border-black">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Tagline */}
                    <div className="inline-block mb-6 px-4 py-2 bg-primary border-3 border-black shadow-brutal-sm">
                        <span className="font-bold">🐂 สำหรับนักลงทุนไทยที่สนใจหุ้นอเมริกา</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        ศูนย์รวมข้อมูล
                        <span className="bg-primary px-3 py-1 border-3 border-black shadow-brutal-sm inline-block mt-2">
                            หุ้นอเมริกา
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-text-secondary mb-8">
                        วิเคราะห์หุ้น S&P 500, NASDAQ 100 และ ETF ยอดนิยม
                        <br />
                        พร้อมบทวิเคราะห์ภาษาไทยที่เข้าใจง่าย
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-8">
                        <form action="/stocks" className="flex gap-2">
                            <div className="flex-1">
                                <SearchInput
                                    name="search"
                                    placeholder="ค้นหาหุ้น... (AAPL, Tesla, NVIDIA)"
                                    className="w-full text-lg py-4"
                                />
                            </div>
                            <Button type="submit" variant="primary" size="lg">
                                ค้นหา
                            </Button>
                        </form>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/stocks/sp500">
                            <Button variant="primary" size="lg">
                                ดู S&P 500
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/stocks/nasdaq100">
                            <Button variant="secondary" size="lg">
                                ดู NASDAQ 100
                            </Button>
                        </Link>
                        <Link href="/etf">
                            <Button variant="outline" size="lg">
                                ETF ยอดนิยม
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
