import { getProducts } from '@/app/actions/products'
import { FeaturedProductsClient } from './featured-products-client'

export async function FeaturedProducts() {
  const { data: products } = await getProducts({ featured: true, pageSize: 6 })

  return <FeaturedProductsClient products={products} />
}
