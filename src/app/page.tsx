import Hero from "@/components/home/Hero";
// import ValueStrip from "@/components/home/ValueStrip"; // Temporarily hidden on home.
import FeaturedProducts from "@/components/home/FeaturedProducts";
// import HowItWorks from "@/components/home/HowItWorks"; // Temporarily hidden on home.
// import Occasions from "@/components/home/Occasions"; // Temporarily hidden on home.
import Testimonials from "@/components/home/Testimonials";
import AboutTeaser from "@/components/home/AboutTeaser";
import ProductBannerCarousel from "@/components/home/ProductBannerCarousel";
import { listHomeCollections } from "@/lib/home-collections";

export default async function Home() {
  const collections = await listHomeCollections();

  return (
    <>
      <Hero />
      <ProductBannerCarousel collections={collections} />
      <FeaturedProducts />
      {/* Temporarily hidden: restore these sections by removing the comments below. */}
      {/* <ValueStrip /> */}
      {/* <HowItWorks /> */}
      {/* <Occasions /> */}
      <div className="relative isolate overflow-hidden bg-night">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[38%] bottom-0 bg-[radial-gradient(90%_62%_at_50%_58%,rgba(210,96,63,0.22)_0%,rgba(210,96,63,0.08)_42%,transparent_74%)]"
        />
        <Testimonials />
        <AboutTeaser />
      </div>
    </>
  );
}
