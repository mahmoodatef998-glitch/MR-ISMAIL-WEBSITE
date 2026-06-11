import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateRFQRef(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `RFQ-${year}-${random}`
}

export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function parseJsonSafe<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    in_review: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    out_of_stock: 'bg-red-100 text-red-800',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

export function getStatusLabel(status: string, lang: 'en' | 'ar' = 'en'): string {
  const labels: Record<string, Record<string, string>> = {
    en: {
      new: 'New',
      in_review: 'In Review',
      quoted: 'Quoted',
      closed: 'Closed',
      active: 'Active',
      inactive: 'Inactive',
      out_of_stock: 'Out of Stock',
    },
    ar: {
      new: 'جديد',
      in_review: 'قيد المراجعة',
      quoted: 'تم التسعير',
      closed: 'مغلق',
      active: 'نشط',
      inactive: 'غير نشط',
      out_of_stock: 'غير متوفر',
    },
  }
  return labels[lang][status] || status
}
