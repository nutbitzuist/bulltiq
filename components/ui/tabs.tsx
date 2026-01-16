"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TabsContextValue {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
}

function Tabs({ defaultValue, children, className }: TabsProps) {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

function TabsList({ children, className }: TabsListProps) {
    return (
        <div
            className={cn(
                "flex flex-wrap gap-2 p-1 bg-black/5 border-3 border-black",
                className
            )}
        >
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    href?: string;
}

function TabsTrigger({ value, children, className, href }: TabsTriggerProps) {
    const context = React.useContext(TabsContext);
    const isActive = context?.activeTab === value;

    const baseStyles = cn(
        "px-4 py-2 font-semibold transition-all duration-150",
        isActive
            ? "bg-primary shadow-brutal-sm translate-x-[-2px] translate-y-[-2px]"
            : "bg-white hover:bg-primary/20",
        "border-2 border-black",
        className
    );

    if (href) {
        return (
            <Link href={href} className={baseStyles}>
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={() => context?.setActiveTab(value)}
            className={baseStyles}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

function TabsContent({ value, children, className }: TabsContentProps) {
    const context = React.useContext(TabsContext);

    if (context?.activeTab !== value) {
        return null;
    }

    return <div className={cn("mt-4", className)}>{children}</div>;
}

// Link-based tabs for navigation (no context needed)
interface TabNavProps {
    tabs: { id: string; label: string; href: string }[];
    activeTab: string;
    className?: string;
}

function TabNav({ tabs, activeTab, className }: TabNavProps) {
    return (
        <div
            className={cn(
                "flex flex-wrap gap-2 p-1 bg-black/5 border-3 border-black",
                className
            )}
        >
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    href={tab.href}
                    className={cn(
                        "px-4 py-2 font-semibold transition-all duration-150",
                        "border-2 border-black",
                        activeTab === tab.id
                            ? "bg-primary shadow-brutal-sm translate-x-[-2px] translate-y-[-2px]"
                            : "bg-white hover:bg-primary/20"
                    )}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabNav };
