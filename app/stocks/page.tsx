import { redirect } from "next/navigation";

// Redirect /stocks to /stocks/sp500 by default
export default function StocksPage() {
    redirect("/stocks/sp500");
}
