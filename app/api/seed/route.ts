import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// One-time seed endpoint — protected by secret key
// Call: GET /api/seed?secret=seed_mr_ismail_2024
const SEED_SECRET = 'seed_mr_ismail_2024'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Settings
    const settings = [
      { key: 'companyName',  value: 'Mr. Ismail Trading LLC' },
      { key: 'companyNameAr', value: 'السيد إسماعيل للتجارة' },
      { key: 'email',       value: 'info@mr-ismail-trading.ae' },
      { key: 'phone',       value: '+971 50 123 4567' },
      { key: 'whatsapp',    value: '971501234567' },
      { key: 'address',     value: 'Sheikh Zayed Road, Dubai, UAE' },
      { key: 'addressAr',   value: 'شارع الشيخ زايد، دبي، الإمارات' },
    ]
    for (const s of settings) {
      await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s })
    }

    // Products
    const products = [
      {
        name: 'Samsung Galaxy S24 Ultra', nameAr: 'سامسونج جالاكسي S24 الترا',
        slug: 'samsung-galaxy-s24-ultra', category: 'Smartphones', brand: 'Samsung',
        description: 'The Samsung Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED display, 200MP main camera, Snapdragon 8 Gen 3 processor, and built-in S Pen. Ideal for wholesale buyers looking for premium flagship devices.',
        descriptionAr: 'يتميز سامسونج جالاكسي S24 الترا بشاشة Dynamic AMOLED مقاس 6.8 بوصة وكاميرا رئيسية 200 ميغابكسل ومعالج Snapdragon 8 Gen 3 وقلم S Pen المدمج.',
        specs: JSON.stringify([{ key: 'Display', value: '6.8" Dynamic AMOLED, 120Hz' }, { key: 'Processor', value: 'Snapdragon 8 Gen 3' }, { key: 'RAM', value: '12GB' }, { key: 'Storage', value: '256GB / 512GB / 1TB' }, { key: 'Battery', value: '5000mAh' }]),
        moq: 10, images: JSON.stringify(['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500']), status: 'active', featured: true,
      },
      {
        name: 'Apple iPhone 15 Pro Max', nameAr: 'آبل آيفون 15 برو ماكس',
        slug: 'apple-iphone-15-pro-max', category: 'Smartphones', brand: 'Apple',
        description: 'Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, 6.7-inch ProMotion display, and the most advanced iPhone camera system with 5x telephoto zoom.',
        descriptionAr: 'آبل آيفون 15 برو ماكس مع شريحة A17 Pro وتصميم تيتانيوم وشاشة ProMotion مقاس 6.7 بوصة.',
        specs: JSON.stringify([{ key: 'Display', value: '6.7" Super Retina XDR, 120Hz' }, { key: 'Processor', value: 'A17 Pro' }, { key: 'Storage', value: '256GB / 512GB / 1TB' }, { key: 'Battery', value: '4422mAh' }]),
        moq: 5, images: JSON.stringify(['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500']), status: 'active', featured: true,
      },
      {
        name: 'Xiaomi 14 Ultra', nameAr: 'شاومي 14 الترا',
        slug: 'xiaomi-14-ultra', category: 'Smartphones', brand: 'Xiaomi',
        description: 'Xiaomi 14 Ultra with Leica quad camera system, 5000mAh battery with 90W fast charging, Snapdragon 8 Gen 3.',
        descriptionAr: 'شاومي 14 الترا مع نظام كاميرا رباعي Leica وبطارية 5000 مللي أمبير مع شحن سريع 90 واط.',
        specs: JSON.stringify([{ key: 'Display', value: '6.73" LTPO AMOLED, 120Hz' }, { key: 'Processor', value: 'Snapdragon 8 Gen 3' }, { key: 'RAM', value: '16GB' }, { key: 'Battery', value: '5000mAh, 90W fast charge' }]),
        moq: 20, images: JSON.stringify(['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500']), status: 'active', featured: true,
      },
      {
        name: 'Samsung Galaxy A55 5G', nameAr: 'سامسونج جالاكسي A55 5G',
        slug: 'samsung-galaxy-a55-5g', category: 'Smartphones', brand: 'Samsung',
        description: 'Samsung Galaxy A55 5G with 50MP OIS camera, 5000mAh battery, IP67 dust/water resistance.',
        descriptionAr: 'سامسونج جالاكسي A55 5G مع كاميرا 50 ميغابكسل OIS وبطارية 5000 مللي أمبير ومقاومة IP67.',
        specs: JSON.stringify([{ key: 'Display', value: '6.6" Super AMOLED, 120Hz' }, { key: 'Processor', value: 'Exynos 1480' }, { key: 'RAM', value: '8GB' }, { key: 'Battery', value: '5000mAh, 25W' }]),
        moq: 25, images: JSON.stringify(['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500']), status: 'active', featured: false,
      },
      {
        name: 'Apple iPhone 15', nameAr: 'آبل آيفون 15',
        slug: 'apple-iphone-15', category: 'Smartphones', brand: 'Apple',
        description: 'Apple iPhone 15 with Dynamic Island, 48MP main camera, USB-C, and A16 Bionic chip.',
        descriptionAr: 'آبل آيفون 15 مع Dynamic Island وكاميرا رئيسية 48 ميغابكسل وUSB-C وشريحة A16 Bionic.',
        specs: JSON.stringify([{ key: 'Display', value: '6.1" Super Retina XDR, 60Hz' }, { key: 'Processor', value: 'A16 Bionic' }, { key: 'Storage', value: '128GB / 256GB / 512GB' }, { key: 'Connector', value: 'USB-C' }]),
        moq: 10, images: JSON.stringify(['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500']), status: 'active', featured: true,
      },
      {
        name: 'Samsung 25W USB-C Fast Charger', nameAr: 'شاحن سامسونج USB-C سريع 25 واط',
        slug: 'samsung-25w-usbc-charger', category: 'Accessories', brand: 'Samsung',
        description: 'Official Samsung 25W USB-C Super Fast Charging adapter. Compatible with all Samsung Galaxy devices.',
        descriptionAr: 'محول الشحن السريع الرسمي من سامسونج 25 واط USB-C.',
        specs: JSON.stringify([{ key: 'Power Output', value: '25W' }, { key: 'Technology', value: 'Super Fast Charging 2.0' }, { key: 'Connector', value: 'USB-C' }]),
        moq: 100, images: JSON.stringify(['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500']), status: 'active', featured: false,
      },
      {
        name: 'Apple AirPods Pro (2nd Gen)', nameAr: 'آبل AirPods Pro الجيل الثاني',
        slug: 'apple-airpods-pro-2nd-gen', category: 'Accessories', brand: 'Apple',
        description: 'Apple AirPods Pro 2nd Generation with Active Noise Cancellation, USB-C charging case, up to 30 hours battery.',
        descriptionAr: 'آبل AirPods Pro الجيل الثاني مع إلغاء الضوضاء النشط وعمر بطارية يصل إلى 30 ساعة.',
        specs: JSON.stringify([{ key: 'ANC', value: 'Active Noise Cancellation' }, { key: 'Battery (total)', value: 'Up to 30 hours' }, { key: 'Chip', value: 'Apple H2' }]),
        moq: 20, images: JSON.stringify(['https://images.unsplash.com/photo-1606741965509-717cc3d74fde?w=500']), status: 'active', featured: true,
      },
      {
        name: 'Anker 20000mAh Power Bank', nameAr: 'باور بنك أنكر 20000 مللي أمبير',
        slug: 'anker-20000mah-power-bank', category: 'Accessories', brand: 'Anker',
        description: 'Anker 737 Power Bank with 140W PD charging, 20000mAh capacity, USB-C + USB-A ports.',
        descriptionAr: 'باور بنك أنكر 737 مع شحن PD بقدرة 140 واط وسعة 20000 مللي أمبير.',
        specs: JSON.stringify([{ key: 'Capacity', value: '20000mAh' }, { key: 'Max Output', value: '140W USB-C' }, { key: 'Ports', value: 'USB-C x2, USB-A x1' }]),
        moq: 50, images: JSON.stringify(['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500']), status: 'active', featured: false,
      },
      {
        name: 'Samsung S24 Screen Replacement Kit', nameAr: 'طقم تغيير شاشة سامسونج S24',
        slug: 'samsung-s24-screen-replacement-kit', category: 'Spare Parts', brand: 'Samsung',
        description: 'Original Samsung Galaxy S24 AMOLED screen replacement assembly. OEM quality for professional repair shops.',
        descriptionAr: 'مجموعة استبدال شاشة AMOLED أصلية لسامسونج جالاكسي S24 للمحلات المتخصصة.',
        specs: JSON.stringify([{ key: 'Part', value: 'AMOLED Screen Assembly' }, { key: 'Type', value: 'OEM Original' }, { key: 'Warranty', value: '3 Months' }]),
        moq: 5, images: JSON.stringify(['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500']), status: 'active', featured: false,
      },
      {
        name: 'iPhone 15 Battery Replacement (OEM)', nameAr: 'بطارية آيفون 15 بديلة OEM',
        slug: 'iphone-15-battery-replacement-oem', category: 'Spare Parts', brand: 'Apple',
        description: 'OEM iPhone 15 battery replacement with original 3877mAh capacity. Professional repair shop supply.',
        descriptionAr: 'بطارية آيفون 15 البديلة من OEM بسعة أصلية 3877 مللي أمبير.',
        specs: JSON.stringify([{ key: 'Capacity', value: '3877mAh' }, { key: 'Type', value: 'OEM Li-Ion' }, { key: 'Compatibility', value: 'iPhone 15' }]),
        moq: 10, images: JSON.stringify(['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500']), status: 'active', featured: false,
      },
    ]

    let inserted = 0
    for (const p of products) {
      await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p })
      inserted++
    }

    return NextResponse.json({ success: true, settings: settings.length, products: inserted })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
