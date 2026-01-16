// Navigation items (Thai)
export const NAV_ITEMS = [
    { href: "/", label: "หน้าแรก" },
    { href: "/stocks", label: "หุ้น" },
    { href: "/etf", label: "ETF" },
    { href: "/blog", label: "บทความ" },
    { href: "/about", label: "เกี่ยวกับเรา" },
] as const;

// Index tabs
export const INDEX_TABS = [
    { id: "sp500", label: "S&P 500", href: "/stocks/sp500" },
    { id: "nasdaq100", label: "NASDAQ 100", href: "/stocks/nasdaq100" },
    { id: "dow-jones", label: "Dow Jones", href: "/stocks/dow-jones" },
    { id: "etf", label: "ETF ยอดนิยม", href: "/etf" },
] as const;

// Sectors
export const SECTORS = [
    { value: "all", label: "ทุกกลุ่มอุตสาหกรรม" },
    { value: "Technology", label: "เทคโนโลยี" },
    { value: "Healthcare", label: "สุขภาพ" },
    { value: "Financials", label: "การเงิน" },
    { value: "Consumer Discretionary", label: "สินค้าไม่จำเป็น" },
    { value: "Communication Services", label: "บริการสื่อสาร" },
    { value: "Industrials", label: "อุตสาหกรรม" },
    { value: "Consumer Staples", label: "สินค้าจำเป็น" },
    { value: "Energy", label: "พลังงาน" },
    { value: "Utilities", label: "สาธารณูปโภค" },
    { value: "Real Estate", label: "อสังหาริมทรัพย์" },
    { value: "Materials", label: "วัตถุดิบ" },
] as const;

// Market cap ranges
export const MARKET_CAP_RANGES = [
    { value: "all", label: "ทุกขนาด" },
    { value: "mega", label: "Mega Cap (>$200B)" },
    { value: "large", label: "Large Cap ($10B-$200B)" },
    { value: "mid", label: "Mid Cap ($2B-$10B)" },
    { value: "small", label: "Small Cap (<$2B)" },
] as const;

// Per page options
export const PER_PAGE_OPTIONS = [25, 50, 100] as const;

// Thai UI text
export const UI_TEXT = {
    // Common
    search: "ค้นหา",
    searchPlaceholder: "ค้นหาหุ้น...",
    viewMore: "ดูเพิ่มเติม",
    viewAll: "ดูทั้งหมด",
    loading: "กำลังโหลด...",
    noData: "ไม่พบข้อมูล",
    error: "เกิดข้อผิดพลาด",

    // Stock table headers
    symbol: "สัญลักษณ์",
    company: "บริษัท",
    price: "ราคา",
    change: "เปลี่ยนแปลง",
    marketCap: "มูลค่าตลาด",
    volume: "ปริมาณ",

    // Stock details
    high52w: "สูงสุด 52 สัปดาห์",
    low52w: "ต่ำสุด 52 สัปดาห์",
    peRatio: "P/E Ratio",
    eps: "EPS",
    dividendYield: "เงินปันผล",
    beta: "Beta",
    sector: "กลุ่มอุตสาหกรรม",
    industry: "อุตสาหกรรม",

    // Analysis sections
    overview: "ภาพรวมบริษัท",
    strengths: "จุดเด่น",
    risks: "ปัจจัยเสี่ยง",
    investmentView: "มุมมองการลงทุน",
    lastUpdated: "อัปเดตล่าสุด",

    // Navigation
    home: "หน้าแรก",
    stocks: "หุ้น",
    etf: "ETF",
    blog: "บทความ",
    about: "เกี่ยวกับเรา",

    // Pagination
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    showing: "แสดง",
    of: "จาก",
    perPage: "รายการต่อหน้า",

    // Newsletter
    newsletterTitle: "รับข่าวสารและบทวิเคราะห์หุ้นอเมริกาทุกสัปดาห์",
    newsletterButton: "สมัครรับข่าว",
    emailPlaceholder: "อีเมลของคุณ",

    // Hero
    heroTitle: "ศูนย์รวมข้อมูลหุ้นอเมริกา",
    heroSubtitle: "สำหรับนักลงทุนไทย",
    heroDescription: "วิเคราะห์หุ้น S&P 500, NASDAQ 100 และ ETF ยอดนิยม พร้อมบทวิเคราะห์ภาษาไทย",

    // Filters
    filterBySector: "กรองตามกลุ่มอุตสาหกรรม",
    filterByMarketCap: "กรองตามมูลค่าตลาด",
    reset: "รีเซ็ต",

    // Stats
    totalStocks: "หุ้นทั้งหมด",
    gainers: "ตัวที่เพิ่มขึ้น",
    losers: "ตัวที่ลดลง",

    // ETF specific
    expenseRatio: "Expense Ratio",
    aum: "สินทรัพย์ภายใต้การจัดการ",
    category: "ประเภท",

    // Related
    relatedStocks: "หุ้นในกลุ่มเดียวกัน",
} as const;

// Category translations (for blog)
export const CATEGORY_LABELS = {
    education: "ความรู้",
    analysis: "วิเคราะห์หุ้น",
    sector: "วิเคราะห์กลุ่มอุตสาหกรรม",
    "market-update": "อัปเดตตลาด",
} as const;
