'use server'

import { prisma } from '@/lib/db'
import { productSchema, ProductFormData } from '@/lib/validations'
import { Product, ProductSpec } from '@/types'
import { parseJsonSafe } from '@/lib/utils'

function mapProduct(p: {
  id: string
  name: string
  nameAr: string
  slug: string
  category: string
  brand: string
  description: string
  descriptionAr: string
  specs: string
  moq: number
  images: string
  status: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}): Product {
  return {
    ...p,
    specs: parseJsonSafe<ProductSpec[]>(p.specs, []),
    images: parseJsonSafe<string[]>(p.images, []),
    status: p.status as Product['status'],
  }
}

export async function getProducts(options: {
  page?: number
  pageSize?: number
  category?: string
  brand?: string
  search?: string
  sort?: string
  featured?: boolean
  status?: string
}) {
  const {
    page = 1,
    pageSize = 12,
    category,
    brand,
    search,
    sort = 'newest',
    featured,
    status = 'active',
  } = options

  const skip = (page - 1) * pageSize
  const where: Record<string, unknown> = {}

  if (status !== 'all') where.status = status
  if (category && category !== 'all') where.category = category
  if (brand && brand !== 'all') where.brand = brand
  if (featured !== undefined) where.featured = featured
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { nameAr: { contains: search } },
      { brand: { contains: search } },
    ]
  }

  const orderBy =
    sort === 'name'
      ? { name: 'asc' as const }
      : sort === 'category'
      ? { category: 'asc' as const }
      : { createdAt: 'desc' as const }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: pageSize }),
    prisma.product.count({ where }),
  ])

  return {
    data: products.map(mapProduct),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findUnique({ where: { slug } })
  if (!p) return null
  return mapProduct(p)
}

export async function getProductById(id: string): Promise<Product | null> {
  const p = await prisma.product.findUnique({ where: { id } })
  if (!p) return null
  return mapProduct(p)
}

export async function createProduct(data: ProductFormData) {
  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const { specs, images, ...rest } = parsed.data

  try {
    const product = await prisma.product.create({
      data: {
        ...rest,
        specs: JSON.stringify(specs),
        images: JSON.stringify(images),
      },
    })
    return { success: true, product: mapProduct(product) }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create product'
    return { success: false, error: msg }
  }
}

export async function updateProduct(id: string, data: Partial<ProductFormData>) {
  try {
    const updateData: Record<string, unknown> = { ...data }
    if (data.specs) updateData.specs = JSON.stringify(data.specs)
    if (data.images) updateData.images = JSON.stringify(data.images)

    const product = await prisma.product.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
    })
    return { success: true, product: mapProduct(product) }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update product'
    return { success: false, error: msg }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete product' }
  }
}

export async function getBrands(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { status: 'active' },
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' },
  })
  return products.map((p) => p.brand)
}
