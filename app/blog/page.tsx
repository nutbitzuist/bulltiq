import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
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

// Group definitions
const CATEGORY_GROUPS = [
    {
        title: "มือใหม่ & พื้นฐาน",
        description: "เริ่มต้นเรียนรู้พื้นฐานการลงทุนหุ้นอเมริกา",
        categories: ["เริ่มต้นลงทุน", "พื้นฐาน", "ความเสี่ยง"]
    },
    {
        title: "วิเคราะห์ & กลยุทธ์",
        description: "เจาะลึกเทคนิคการวิเคราะห์และกลยุทธ์การลงทุน",
        categories: ["การวิเคราะห์", "กลยุทธ์", "เงินปันผล", "หุ้นเทคโนโลยี", "อุตสาหกรรม", "ดัชนีหุ้น"]
    },
    {
        title: "ETF & กองทุน",
        description: "คู่มือการลงทุนผ่าน ETF และกองทุนรวม",
        categories: ["ETF"]
    }
];

export default function BlogPage() {
    // Sort all articles by date first
    const sortedArticles = [...articles].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        📚 คลังความรู้
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        แหล่งรวมบทความลงทุนหุ้นอเมริกา ตั้งแต่พื้นฐานจนถึงระดับมืออาชีพ
                    </p>
                </div>

                {/* Categories Sections */}
                <div className="space-y-16">
                    {CATEGORY_GROUPS.map((group) => {
                        const groupArticles = sortedArticles.filter(a =>
                            group.categories.includes(a.category)
                        );

                        if (groupArticles.length === 0) return null;

                        return (
                            <section key={group.title}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-10 w-2 bg-primary"></div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold">{group.title}</h2>
                                        <p className="text-text-secondary">{group.description}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {groupArticles.map((article) => (
                                        <Link key={article.id} href={`/blog/${article.slug}`} className="group">
                                            <Card className="h-full border-2 border-black hover:shadow-brutal-md transition-all duration-300 hover:translate-y-[-4px]">
                                                <CardContent className="p-6 flex flex-col h-full">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="text-4xl bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform">
                                                            {article.coverEmoji}
                                                        </div>
                                                        <Badge variant="outline" className="bg-white">
                                                            {article.category}
                                                        </Badge>
                                                    </div>

                                                    <h3 className="text-xl font-bold font-display mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                        {article.title}
                                                    </h3>

                                                    <p className="text-text-secondary mb-6 line-clamp-2 text-sm">
                                                        {article.excerpt}
                                                    </p>

                                                    <div className="mt-auto flex items-center gap-4 text-xs text-text-secondary font-medium">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatThaiDate(article.publishedAt)}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3" />
                                                            {article.readTime}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
