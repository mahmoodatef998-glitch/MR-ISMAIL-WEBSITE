import { Hero } from '@/components/home/hero'
import { Categories } from '@/components/home/categories'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CTASection } from '@/components/home/cta-section'
import { TrustBadges } from '@/components/home/trust-badges'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <WhyChooseUs />
      <FeaturedProducts />
      <TrustBadges />
      <CTASection />
    </>
  )
}
