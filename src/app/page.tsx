import Hero from "@/components/home/Hero";
import ValueStrip from "@/components/home/ValueStrip";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import Occasions from "@/components/home/Occasions";
import Testimonials from "@/components/home/Testimonials";
import AboutTeaser from "@/components/home/AboutTeaser";

export default function Home() {
  return (
    <>
      <Hero />
      <ValueStrip />
      <FeaturedProducts />
      <HowItWorks />
      <Occasions />
      <Testimonials />
      <AboutTeaser />
    </>
  );
}
