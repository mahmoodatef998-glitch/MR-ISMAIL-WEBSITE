import { HeroSection } from '@/components/sections/hero-section'
import { BrandsStrip } from '@/components/sections/brands-strip'
import { ProductsSection } from '@/components/sections/products-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { AboutSection } from '@/components/sections/about-section'
import { ProcessSection } from '@/components/sections/process-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { ContactSection } from '@/components/sections/contact-section'
import { prisma } from '@/lib/db'
import { Product, ProductSpec } from '@/types'
import { parseJsonSafe } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { status: 'active' },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: 30,
    })
    return rows.map((p) => ({
      ...p,
      specs: parseJsonSafe<ProductSpec[]>(p.specs, []),
      images: parseJsonSafe<string[]>(p.images, []),
      status: p.status as Product['status'],
    }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <BrandsStrip />
      <ProductsSection products={products} />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
