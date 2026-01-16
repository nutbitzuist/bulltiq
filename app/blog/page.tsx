import { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import blogPosts from "@/data/blog-posts.json";

export const metadata: Metadata = {
    title: "บทความ | Bulltiq - ความรู้การลงทุนหุ้นอเมริกาสำหรับคนไทย",
    description: "อ่านบทความความรู้การลงทุนหุ้นอเมริกา เขียนภาษาไทยที่เข้าใจง่าย ครอบคลุม S&P 500, NASDAQ 100, ETF และกลยุทธ์การลงทุน",
    openGraph: {
        title: "บทความ | Bulltiq",
        description: "ความรู้การลงทุนหุ้นอเมริกาสำหรับคนไทย",
        type: "website",
    },
};

// Get unique categories
const categories = Array.from(new Set(blogPosts.map(post => post.category)));

export default function BlogPage() {
    const featuredPost = blogPosts[0];
    const recentPosts = blogPosts.slice(1);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-12 md:py-16 bg-primary border-b-3 border-black">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
                            บทความ{" "}
                            <span className="bg-black text-primary px-3 py-1">Bulltiq</span>
                        </h1>
                        <p className="text-lg text-text-secondary">
                            ความรู้การลงทุนหุ้นอเมริกา เขียนภาษาไทยที่เข้าใจง่าย
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-6 bg-surface border-b-3 border-black">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Link href="/blog">
                            <Badge variant="default" className="cursor-pointer">
                                ทั้งหมด
                            </Badge>
                        </Link>
                        {categories.map((category) => (
                            <Badge key={category} variant="outline" className="cursor-pointer">
                                {category}
                            </Badge>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-12 container mx-auto px-4">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-accent-orange text-white px-2 py-1 text-sm">⭐</span>
                    บทความแนะนำ
                </h2>
                <Link href={`/blog/${featuredPost.slug}`}>
                    <Card className="overflow-hidden hover:shadow-brutal-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                        <div className="md:flex">
                            <div className="md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-primary to-accent-orange flex items-center justify-center border-b-3 md:border-b-0 md:border-r-3 border-black">
                                <span className="text-6xl">📈</span>
                            </div>
                            <div className="md:w-3/5 p-6">
                                <Badge variant="default" className="mb-3">
                                    {featuredPost.category}
                                </Badge>
                                <h3 className="text-2xl font-bold mb-3 hover:text-accent-blue transition-colors">
                                    {featuredPost.title}
                                </h3>
                                <p className="text-text-secondary mb-4 line-clamp-2">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        {featuredPost.author}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(featuredPost.publishedAt).toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {featuredPost.readingTime} นาที
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Link>
            </section>

            {/* Recent Posts */}
            <section className="py-12 bg-surface border-y-3 border-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="bg-accent-blue text-white px-2 py-1 text-sm">📝</span>
                        บทความล่าสุด
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentPosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`}>
                                <Card className="h-full hover:shadow-brutal-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                                    <div className="h-32 bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                                        <span className="text-4xl">
                                            {post.category === 'Investment Guide' ? '📚' :
                                                post.category === 'Market Analysis' ? '📊' :
                                                    post.category === 'Stock Analysis' ? '🔍' : '📝'}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <Badge variant="outline" className="mb-2 text-xs">
                                            {post.category}
                                        </Badge>
                                        <h3 className="font-bold mb-2 line-clamp-2 hover:text-accent-blue transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {post.readingTime} นาที
                                            </span>
                                            <span>
                                                {new Date(post.publishedAt).toLocaleDateString('th-TH', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 bg-black text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        ไม่พลาดบทความใหม่
                    </h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto">
                        สมัครรับข่าวสารเพื่อรับบทความความรู้การลงทุนใหม่ๆ ส่งตรงถึงอีเมลของคุณ
                    </p>
                    <Link href="/">
                        <Button variant="primary" size="lg" className="bg-primary text-black">
                            สมัครรับข่าวสาร
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
