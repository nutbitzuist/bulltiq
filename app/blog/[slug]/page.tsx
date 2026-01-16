import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import blogArticles from "@/data/blog-articles.json";

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
const articleMap = new Map<string, BlogArticle>();
articles.forEach((article) => {
    articleMap.set(article.slug, article);
});

interface PageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const article = articleMap.get(params.slug);

    if (!article) {
        return { title: "ไม่พบบทความ" };
    }

    return {
        title: `${article.title} | Bulltiq Blog`,
        description: article.excerpt,
    };
}

export function generateStaticParams() {
    return articles.map((article) => ({ slug: article.slug }));
}

function formatThaiDate(dateString: string): string {
    const date = new Date(dateString);
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
}

function renderContent(content: string) {
    // Split by double newline to identify paragraphs
    const sections = content.split('\n\n');

    return sections.map((section, i) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // Check if it's a list (starts with • or - or number)
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\.\s/.test(trimmed.substring(0, 5))) {
            const lines = trimmed.split('\n');
            // If it's a bullet list
            if (lines.every(line => line.trim().startsWith('•') || line.trim().startsWith('-'))) {
                return (
                    <ul key={i} className="mb-6 space-y-2 list-disc pl-6">
                        {lines.map((line, j) => (
                            <li key={j} className="text-text-primary text-lg leading-relaxed">
                                {line.replace(/^[•\-]\s*/, '').trim()}
                            </li>
                        ))}
                    </ul>
                );
            }
        }

        // Check if it looks like a header (short, no punctuation at end usually, or starts with known header patterns)
        // Relaxed rule: just check if it's short and looks like a topic
        const isHeader = (
            (trimmed.length < 100 && (trimmed.endsWith('?') || trimmed.startsWith('คำถาม') || trimmed.startsWith('สรุป') || /^\d+\.\s/.test(trimmed)))
        );

        if (isHeader) {
            return (
                <h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-primary">
                    {trimmed}
                </h2>
            );
        }

        // Regular paragraph
        return (
            <p key={i} className="mb-6 text-text-primary text-lg leading-relaxed text-justify">
                {trimmed}
            </p>
        );
    });
}

export default function BlogArticlePage({ params }: PageProps) {
    const article = articleMap.get(params.slug);

    if (!article) {
        notFound();
    }

    // Get related articles
    const relatedArticles = articles
        .filter((a) => a.slug !== article.slug)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm">
                    <Link href="/" className="text-text-secondary hover:text-accent-blue">
                        หน้าแรก
                    </Link>
                    <span className="text-text-secondary">&gt;</span>
                    <Link href="/blog" className="text-text-secondary hover:text-accent-blue">
                        บทความ
                    </Link>
                    <span className="text-text-secondary">&gt;</span>
                    <span className="font-semibold truncate max-w-[200px]">{article.title}</span>
                </nav>

                {/* Back Button */}
                <Link href="/blog" className="inline-block mb-6">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        กลับไปบทความทั้งหมด
                    </Button>
                </Link>

                {/* Article Header */}
                <Card className="mb-8">
                    <CardContent className="p-8">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">{article.coverEmoji}</div>
                            <Badge variant="info" className="mb-4">
                                {article.category}
                            </Badge>
                            <h1 className="text-3xl font-bold font-display mb-4">
                                {article.title}
                            </h1>
                            <p className="text-lg text-text-secondary mb-4">
                                {article.excerpt}
                            </p>
                            <div className="flex items-center justify-center gap-4 text-sm text-text-secondary">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatThaiDate(article.publishedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {article.readTime}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Article Content */}
                <Card className="mb-8">
                    <CardContent className="p-8">
                        <article className="prose max-w-none">
                            {renderContent(article.content)}
                        </article>
                    </CardContent>
                </Card>

                {/* Disclaimer */}
                <Card className="mb-8 bg-yellow-50 border-yellow-400">
                    <CardContent className="p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>⚠️ ข้อสงวนสิทธิ์:</strong> บทความนี้จัดทำขึ้นเพื่อให้ความรู้เท่านั้น ไม่ถือเป็นคำแนะนำในการลงทุน
                            ผู้อ่านควรศึกษาข้อมูลเพิ่มเติมและปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจลงทุน
                        </p>
                    </CardContent>
                </Card>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">📖 บทความที่เกี่ยวข้อง</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {relatedArticles.map((related) => (
                                <Link key={related.id} href={`/blog/${related.slug}`}>
                                    <Card className="h-full hover:shadow-brutal-md transition-all">
                                        <CardContent className="p-4">
                                            <div className="text-2xl mb-2">{related.coverEmoji}</div>
                                            <h3 className="font-bold text-sm line-clamp-2">
                                                {related.title}
                                            </h3>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
