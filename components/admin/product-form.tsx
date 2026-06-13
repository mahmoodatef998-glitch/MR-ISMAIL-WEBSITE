'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct } from '@/app/actions/products'
import { slugify } from '@/lib/utils'
import { ProductFormData } from '@/lib/validations'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ImageUploader } from './image-uploader'

interface Props {
  initialData?: Partial<ProductFormData> & { id?: string }
  mode: 'create' | 'edit'
}

export function ProductForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<ProductFormData>({
    name: initialData?.name || '',
    nameAr: initialData?.nameAr || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'Smartphones',
    brand: initialData?.brand || '',
    description: initialData?.description || '',
    descriptionAr: initialData?.descriptionAr || '',
    specs: initialData?.specs || [],
    moq: initialData?.moq || 1,
    images: initialData?.images || [],
    status: initialData?.status || 'active',
    featured: initialData?.featured || false,
  })

  const handleNameChange = (name: string) => {
    setData({ ...data, name, slug: slugify(name) })
  }

  const addSpec = () => {
    setData({ ...data, specs: [...data.specs, { key: '', value: '' }] })
  }

  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const specs = [...data.specs]
    specs[i] = { ...specs[i], [field]: val }
    setData({ ...data, specs })
  }

  const removeSpec = (i: number) => {
    setData({ ...data, specs: data.specs.filter((_, idx) => idx !== i) })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result =
      mode === 'edit' && initialData?.id
        ? await updateProduct(initialData.id, data)
        : await createProduct(data)

    setIsLoading(false)

    if (result.success) {
      toast({ title: mode === 'edit' ? 'Product updated!' : 'Product created!', variant: 'success' as any })
      router.push('/admin/products')
      router.refresh()
    } else {
      toast({ title: result.error || 'Error', variant: 'destructive' })
    }
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <Label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</Label>
      {children}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Product Name (English) *">
            <Input value={data.name} onChange={(e) => handleNameChange(e.target.value)} required />
          </Field>
          <Field label="اسم المنتج (Arabic) *">
            <Input value={data.nameAr} onChange={(e) => setData({ ...data, nameAr: e.target.value })} dir="rtl" required />
          </Field>
          <Field label="Slug (URL)">
            <Input value={data.slug} onChange={(e) => setData({ ...data, slug: e.target.value })} className="font-mono text-xs" />
          </Field>
          <Field label="Brand *">
            <Input value={data.brand} onChange={(e) => setData({ ...data, brand: e.target.value })} required />
          </Field>
          <Field label="Category *">
            <select
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value as ProductFormData['category'] })}
              className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
              required
            >
              <option value="Smartphones">Smartphones</option>
              <option value="Accessories">Accessories</option>
              <option value="Spare Parts">Spare Parts</option>
            </select>
          </Field>
          <Field label="MOQ (Minimum Order Quantity) *">
            <Input
              type="number"
              min={1}
              value={data.moq}
              onChange={(e) => setData({ ...data, moq: parseInt(e.target.value) || 1 })}
              required
            />
          </Field>
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Descriptions</h2>
        <div className="space-y-4">
          <Field label="Description (English) *">
            <Textarea rows={4} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} required />
          </Field>
          <Field label="الوصف (Arabic) *">
            <Textarea rows={4} value={data.descriptionAr} onChange={(e) => setData({ ...data, descriptionAr: e.target.value })} dir="rtl" required />
          </Field>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Specifications</h2>
          <Button type="button" variant="outline" size="sm" onClick={addSpec}>
            <Plus className="w-3 h-3 mr-1" /> Add Spec
          </Button>
        </div>
        {data.specs.length === 0 ? (
          <p className="text-sm text-gray-400">No specifications added yet.</p>
        ) : (
          <div className="space-y-2">
            {data.specs.map((spec, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Key (e.g. RAM)"
                  value={spec.key}
                  onChange={(e) => updateSpec(i, 'key', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value (e.g. 8GB)"
                  value={spec.value}
                  onChange={(e) => updateSpec(i, 'value', e.target.value)}
                  className="flex-1"
                />
                <button type="button" onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Images</h2>
        <ImageUploader
          images={data.images}
          onChange={(images) => setData({ ...data, images })}
        />
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Status & Visibility</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Status">
            <select
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value as ProductFormData['status'] })}
              className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </Field>
          <Field label="Featured on Homepage">
            <div className="flex items-center gap-3 h-10">
              <input
                type="checkbox"
                id="featured"
                checked={data.featured}
                onChange={(e) => setData({ ...data, featured: e.target.checked })}
                className="w-4 h-4 accent-[#c8a96e]"
              />
              <label htmlFor="featured" className="text-sm text-gray-600">Show on homepage featured section</label>
            </div>
          </Field>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Saving...</> : mode === 'edit' ? 'Update Product' : 'Create Product'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
