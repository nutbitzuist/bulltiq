"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Subscription failed:", error);
            setStatus("error");
        }
    };

    return (
        <section className="py-16 bg-primary border-y-3 border-black">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-block mb-4 p-2 bg-white border-3 border-black shadow-brutal-sm">
                        <Mail className="w-8 h-8" />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        รับข่าวสารและบทวิเคราะห์หุ้นอเมริกาทุกสัปดาห์
                    </h2>

                    <p className="text-text-secondary mb-8">
                        สมัครรับจดหมายข่าวฟรี เพื่อติดตามข่าวสารตลาดหุ้นสหรัฐ
                        และบทวิเคราะห์หุ้นน่าสนใจส่งตรงถึงอีเมลของคุณ
                    </p>

                    {status === "success" ? (
                        <div className="flex items-center justify-center gap-3 bg-white border-3 border-black px-6 py-4 shadow-brutal-md">
                            <CheckCircle className="w-6 h-6 text-success" />
                            <span className="font-semibold">ลงทะเบียนสำเร็จ! ขอบคุณที่สมัครรับข่าวสาร</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="อีเมลของคุณ"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 bg-white"
                            />
                            <Button
                                type="submit"
                                variant="secondary"
                                size="md"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? "กำลังส่ง..." : "สมัครรับข่าว"}
                            </Button>
                        </form>
                    )}

                    <p className="text-sm text-text-secondary mt-4">
                        เราจะไม่ส่งสแปม สามารถยกเลิกการรับข่าวสารได้ตลอดเวลา
                    </p>
                </div>
            </div>
        </section>
    );
}
