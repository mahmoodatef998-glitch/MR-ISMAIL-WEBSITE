export interface Product {
  id: string
  name: string
  nameAr: string
  slug: string
  category: string
  brand: string
  description: string
  descriptionAr: string
  specs: ProductSpec[]
  moq: number
  stock: number
  images: string[]
  status: 'active' | 'inactive' | 'out_of_stock'
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductSpec {
  key: string
  value: string
}

export interface RFQItem {
  productId: string
  productName: string
  quantity: number
}

export interface RFQ {
  id: string
  refNumber: string
  customerName: string
  company: string
  email: string
  phone: string
  country: string
  city: string
  items: RFQItem[]
  message?: string
  status: 'new' | 'in_review' | 'quoted' | 'closed'
  notes?: string
  confirmedProductId?: string
  confirmedQty?: number
  createdAt: Date
  updatedAt: Date
}

export interface Setting {
  id: string
  key: string
  value: string
}

export interface SiteSettings {
  companyName: string
  companyNameAr: string
  email: string
  phone: string
  whatsapp: string
  address: string
  addressAr: string
  city: string
  country: string
}

export type Language = 'en' | 'ar'

export interface PaginationResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
