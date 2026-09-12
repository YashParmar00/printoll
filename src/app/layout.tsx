import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import MobileBottomNav from "@/components/site/MobileBottomNav";
import WhatsAppFab from "@/components/site/WhatsAppFab";

// Bold, rounded display face for headlines (variable font — all weights available).
const baloo = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Clean sans for body copy (≥16px on mobile).
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — Custom Prints Made Personal`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Custom Prints Made Personal`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${baloo.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-paper pb-16 text-noir antialiased lg:pb-0">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomNav />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
