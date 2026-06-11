import { notFound } from 'next/navigation'
import { getProductById } from '@/app/actions/products'
import { ProductForm } from '@/components/admin/product-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Edit Product: {product.name}</h1>
      <ProductForm
        mode="edit"
        initialData={{
          id: product.id,
          name: product.name,
          nameAr: product.nameAr,
          slug: product.slug,
          category: product.category as 'Smartphones' | 'Accessories' | 'Spare Parts',
          brand: product.brand,
          description: product.description,
          descriptionAr: product.descriptionAr,
          specs: product.specs,
          moq: product.moq,
          images: product.images,
          status: product.status as 'active' | 'inactive' | 'out_of_stock',
          featured: product.featured,
        }}
      />
    </div>
  )
}
