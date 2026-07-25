import type { Metadata } from "next";
import { Playfair_Display, Poppins, Dancing_Script } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import MobileBottomNav from "@/components/site/MobileBottomNav";
import WhatsAppFab from "@/components/site/WhatsAppFab";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Script face for the engraving live-preview.
const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
    title: `${site.name} — Personalized Gifts, Made in India`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Personalized Gifts, Made in India`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} ${dancing.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-white pb-16 text-charcoal antialiased lg:pb-0">
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
