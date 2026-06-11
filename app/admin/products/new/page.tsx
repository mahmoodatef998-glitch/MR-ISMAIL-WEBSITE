import { ProductForm } from '@/components/admin/product-form'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h1>
      <ProductForm mode="create" />
    </div>
  )
}
