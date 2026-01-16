"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Copy, Check, Mail, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
    stockName?: string;
    ticker?: string;
    url?: string; // Optional URL override
    customText?: string; // Optional custom share text
    customTitle?: string; // Optional custom share title
}

export function ShareButton({ stockName, ticker, url, customText, customTitle }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : '';
    const shareTitle = customTitle || `เจาะลึกหุ้น ${ticker} - ${stockName} กับ Bulltiq`;
    const shareText = customText || `รู้ลึก รู้จริง ก่อนลงทุน! อ่านบทวิเคราะห์หุ้น ${ticker} (${stockName}) แบบเจาะลึก พร้อมข้อมูลเชิงลึกโอกาสและความเสี่ยง ได้ที่ Bulltiq`;

    // Toggle dropdown
    const toggleOpen = () => setIsOpen(!isOpen);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCopy = async () => {
        try {
            // Copy formatted message with URL instead of just the URL
            const copyText = `${shareUrl}\nอ่านบทวิเคราะห์หุ้น ${ticker} (${stockName}) แบบเจาะลึกได้ที่ Bulltiq.com`;
            await navigator.clipboard.writeText(copyText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            setIsOpen(false);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };


    const socialLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: "text-blue-600"
        },
        {
            name: "Line",
            icon: MessageCircle, // Lucide doesn't have Line icon, using MessageCircle as generic
            href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`,
            color: "text-green-500"
        },
        {
            name: "WhatsApp",
            icon: MessageCircle,
            href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
            color: "text-green-600"
        },
        {
            name: "Email",
            icon: Mail,
            href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
            color: "text-gray-600"
        }
    ];

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <Button variant="outline" size="sm" onClick={toggleOpen}>
                <Share2 className="w-4 h-4 mr-2" />
                แชร์
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-1">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => setIsOpen(false)}
                            >
                                <link.icon className={`w-4 h-4 mr-2 ${link.color}`} />
                                {link.name}
                            </a>
                        ))}
                        <button
                            onClick={handleCopy}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t border-gray-100"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4 mr-2 text-gray-500" />
                            )}
                            {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
