import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import blogArticles from "@/data/blog-articles.json";

export const metadata: Metadata = {
    title: "บทความ | เรียนรู้การลงทุนหุ้นอเมริกา",
    description: "บทความให้ความรู้เกี่ยวกับการลงทุนหุ้นสหรัฐอเมริกา S&P 500 NASDAQ 100 และ ETF สำหรับนักลงทุนไทย",
};

interface BlogArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    publishedAt: string;
    readTime: string;
    coverEmoji: string;
    content: string;
}

const articles = blogArticles as BlogArticle[];

function formatThaiDate(dateString: string): string {
    const date = new Date(dateString);
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
}

export default function BlogPage() {
    // Sort by date descending
    const sortedArticles = [...articles].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-display mb-4">
                        📚 บทความ
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl">
                        เรียนรู้การลงทุนหุ้นอเมริกาตั้งแต่เริ่มต้น ด้วยบทความที่เขียนขึ้นสำหรับนักลงทุนไทยโดยเฉพาะ
                    </p>
                </div>

                {/* Featured Article */}
                {sortedArticles[0] && (
                    <Link href={`/blog/${sortedArticles[0].slug}`} className="block mb-8">
                        <Card className="bg-gradient-to-r from-accent-purple/10 to-accent-blue/10 hover:shadow-brutal-lg transition-all">
                            <CardContent className="p-8">
                                <Badge variant="success" className="mb-4">
                                    บทความล่าสุด
                                </Badge>
                                <div className="flex items-start gap-6">
                                    <div className="text-6xl">{sortedArticles[0].coverEmoji}</div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold font-display mb-2">
                                            {sortedArticles[0].title}
                                        </h2>
                                        <p className="text-text-secondary mb-4">
                                            {sortedArticles[0].excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatThaiDate(sortedArticles[0].publishedAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {sortedArticles[0].readTime}
                                            </span>
                                            <Badge variant="info">{sortedArticles[0].category}</Badge>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-accent-purple" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}

                {/* Article Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedArticles.slice(1).map((article) => (
                        <Link key={article.id} href={`/blog/${article.slug}`}>
                            <Card className={cn(
                                "h-full hover:shadow-brutal-lg transition-all",
                                "hover:translate-x-1 hover:translate-y-1"
                            )}>
                                <CardContent className="p-6">
                                    <div className="text-4xl mb-4">{article.coverEmoji}</div>
                                    <Badge variant="info" className="mb-2">
                                        {article.category}
                                    </Badge>
                                    <h3 className="text-lg font-bold font-display mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatThaiDate(article.publishedAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {article.readTime}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {articles.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-bold mb-2">ยังไม่มีบทความ</h3>
                        <p className="text-text-secondary">
                            กำลังเตรียมเนื้อหาให้คุณ โปรดติดตาม
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
