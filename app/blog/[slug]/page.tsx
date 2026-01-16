import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/stocks/share-button";
import { Calendar, Clock, User, ArrowLeft, BookOpen } from "lucide-react";
import blogPosts from "@/data/blog-posts.json";

interface BlogPostPageProps {
    params: { slug: string };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        return {
            title: "บทความไม่พบ | Bulltiq",
        };
    }

    return {
        title: `${post.title} | Bulltiq`,
        description: post.excerpt,
        keywords: post.tags.join(", "),
        authors: [{ name: post.author }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.publishedAt,
            authors: [post.author],
            tags: post.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    // Get related posts (same category, excluding current)
    const relatedPosts = blogPosts
        .filter((p) => p.category === post.category && p.id !== post.id)
        .slice(0, 3);

    // Convert content to paragraphs
    const paragraphs = post.content.split('\n\n');

    return (
        <>
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": post.title,
                        "description": post.excerpt,
                        "author": {
                            "@type": "Person",
                            "name": post.author
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Bulltiq",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://bulltiq.vercel.app/favicon.ico"
                            }
                        },
                        "datePublished": post.publishedAt,
                        "dateModified": post.publishedAt,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://bulltiq.vercel.app/blog/${post.slug}`
                        },
                        "keywords": post.tags.join(", "),
                        "articleSection": post.category,
                        "inLanguage": "th"
                    })
                }}
            />

            {/* Breadcrumb JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "หน้าแรก",
                                "item": "https://bulltiq.vercel.app"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "บทความ",
                                "item": "https://bulltiq.vercel.app/blog"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": post.title,
                                "item": `https://bulltiq.vercel.app/blog/${post.slug}`
                            }
                        ]
                    })
                }}
            />

            <article className="min-h-screen bg-background">
                {/* Header */}
                <header className="py-12 md:py-16 bg-gradient-to-br from-primary via-primary to-accent-orange border-b-3 border-black">
                    <div className="container mx-auto px-4">
                        {/* Breadcrumb */}
                        <nav className="mb-6">
                            <ol className="flex items-center gap-2 text-sm">
                                <li>
                                    <Link href="/" className="hover:underline">
                                        หน้าแรก
                                    </Link>
                                </li>
                                <li>/</li>
                                <li>
                                    <Link href="/blog" className="hover:underline">
                                        บทความ
                                    </Link>
                                </li>
                                <li>/</li>
                                <li className="text-text-secondary truncate max-w-[200px]">
                                    {post.title}
                                </li>
                            </ol>
                        </nav>

                        <div className="max-w-3xl">
                            <Badge variant="default" className="mb-4">
                                {post.category}
                            </Badge>
                            <h1 className="text-2xl md:text-4xl font-bold font-display mb-6 leading-tight">
                                {post.title}
                            </h1>
                            <p className="text-lg text-text-secondary mb-6">
                                {post.excerpt}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-2 bg-white/80 px-3 py-1 border-2 border-black">
                                    <User className="w-4 h-4" />
                                    {post.author}
                                </span>
                                <span className="flex items-center gap-2 bg-white/80 px-3 py-1 border-2 border-black">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(post.publishedAt).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className="flex items-center gap-2 bg-white/80 px-3 py-1 border-2 border-black">
                                    <Clock className="w-4 h-4" />
                                    {post.readingTime} นาทีในการอ่าน
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto">
                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none">
                            {paragraphs.map((paragraph, index) => {
                                // Check if paragraph looks like a heading (short and no period at end)
                                const isHeading = paragraph.length < 50 && !paragraph.endsWith('.') && !paragraph.endsWith('?');

                                if (isHeading) {
                                    return (
                                        <h2 key={index} className="text-xl md:text-2xl font-bold mt-8 mb-4 text-black">
                                            {paragraph}
                                        </h2>
                                    );
                                }

                                return (
                                    <p key={index} className="text-text-primary leading-relaxed mb-4">
                                        {paragraph}
                                    </p>
                                );
                            })}
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-6 border-t-2 border-black/20">
                            <h3 className="font-bold mb-3">แท็ก:</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <Badge key={tag} variant="outline">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Share */}
                        <div className="mt-8 p-6 bg-surface border-3 border-black">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold mb-1">ชอบบทความนี้?</h3>
                                    <p className="text-sm text-text-secondary">แชร์ให้เพื่อนๆ ได้อ่านด้วย</p>
                                </div>
                                <ShareButton
                                    url={`https://bulltiq.com/blog/${post.slug}`}
                                    customTitle={post.title}
                                    customText={`อ่านบทความ "${post.title}" ได้ที่ Bulltiq`}
                                />
                            </div>
                        </div>

                        {/* Back to Blog */}
                        <div className="mt-8">
                            <Link href="/blog">
                                <Button variant="outline">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    กลับไปหน้าบทความ
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="py-12 bg-surface border-t-3 border-black">
                        <div className="container mx-auto px-4">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                บทความที่เกี่ยวข้อง
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                                        <Card className="h-full hover:shadow-brutal-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                                            <div className="h-24 bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                                                <span className="text-3xl">📝</span>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold mb-2 line-clamp-2">
                                                    {relatedPost.title}
                                                </h3>
                                                <p className="text-sm text-text-secondary line-clamp-2">
                                                    {relatedPost.excerpt}
                                                </p>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="py-12 bg-black text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">
                            เริ่มต้นศึกษาหุ้นอเมริกา
                        </h2>
                        <p className="text-white/80 mb-6">
                            ดูข้อมูลหุ้น S&P 500, NASDAQ 100 และ ETF พร้อมบทวิเคราะห์ภาษาไทย
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/stocks/sp500">
                                <Button variant="primary" className="bg-primary text-black">
                                    หุ้น S&P 500
                                </Button>
                            </Link>
                            <Link href="/stocks/nasdaq100">
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                                    หุ้น NASDAQ 100
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </article>
        </>
    );
}
