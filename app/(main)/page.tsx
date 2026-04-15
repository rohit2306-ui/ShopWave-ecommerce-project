import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProducts } from "@/components/home/featured-products"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedProducts />
    </>
  )
}
