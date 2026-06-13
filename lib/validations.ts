import { z } from 'zod'

export const rfqSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Invalid phone number'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'Please add at least one product'),
  message: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  nameAr: z.string().min(2, 'Arabic name is required'),
  slug: z.string().min(2, 'Slug is required'),
  category: z.enum(['Smartphones', 'Accessories', 'Spare Parts']),
  brand: z.string().min(1, 'Brand is required'),
  description: z.string().min(10, 'Description is required'),
  descriptionAr: z.string().min(10, 'Arabic description is required'),
  specs: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .default([]),
  moq: z.number().min(1, 'MOQ must be at least 1'),
  stock: z.number().min(0).default(0),
  images: z.array(z.string()).default([]),
  status: z.enum(['active', 'inactive', 'out_of_stock']).default('active'),
  featured: z.boolean().default(false),
})

export type RFQFormData = z.infer<typeof rfqSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type ProductFormData = z.infer<typeof productSchema>
