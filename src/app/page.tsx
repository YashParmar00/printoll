import Hero from "@/components/home/Hero";
// import ValueStrip from "@/components/home/ValueStrip"; // Temporarily hidden on home.
import FeaturedProducts from "@/components/home/FeaturedProducts";
// import HowItWorks from "@/components/home/HowItWorks"; // Temporarily hidden on home.
// import Occasions from "@/components/home/Occasions"; // Temporarily hidden on home.
import Testimonials from "@/components/home/Testimonials";
import AboutTeaser from "@/components/home/AboutTeaser";
import ProductBannerCarousel from "@/components/home/ProductBannerCarousel";
import { listCatalogProducts } from "@/lib/catalog";

export default async function Home() {
  const products = await listCatalogProducts();

  return (
    <>
      <Hero />
      <ProductBannerCarousel products={products} />
      <FeaturedProducts />
      {/* Temporarily hidden: restore these sections by removing the comments below. */}
      {/* <ValueStrip /> */}
      {/* <HowItWorks /> */}
      {/* <Occasions /> */}
      <Testimonials />
      <AboutTeaser />
    </>
  );
}
