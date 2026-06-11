import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: dbPath })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@mr-ismail.ae' },
    update: {},
    create: {
      email: 'admin@mr-ismail.ae',
      password: hashedPassword,
      name: 'Mr. Ismail Admin',
    },
  })
  console.log('✅ Admin user created: admin@mr-ismail.ae / admin123')

  // Site settings
  const settings = [
    { key: 'companyName', value: 'Mr. Ismail Trading LLC' },
    { key: 'companyNameAr', value: 'السيد إسماعيل للتجارة' },
    { key: 'email', value: 'info@mr-ismail-trading.ae' },
    { key: 'phone', value: '+971 50 123 4567' },
    { key: 'whatsapp', value: '971501234567' },
    { key: 'address', value: 'Sheikh Zayed Road, Dubai, UAE' },
    { key: 'addressAr', value: 'شارع الشيخ زايد، دبي، الإمارات' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('✅ Site settings seeded')

  // Products
  const products = [
    {
      name: 'Samsung Galaxy S24 Ultra',
      nameAr: 'سامسونج جالاكسي S24 الترا',
      slug: 'samsung-galaxy-s24-ultra',
      category: 'Smartphones',
      brand: 'Samsung',
      description: 'The Samsung Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED display, 200MP main camera, Snapdragon 8 Gen 3 processor, and built-in S Pen. Ideal for wholesale buyers looking for premium flagship devices.',
      descriptionAr: 'يتميز سامسونج جالاكسي S24 الترا بشاشة Dynamic AMOLED مقاس 6.8 بوصة وكاميرا رئيسية 200 ميغابكسل ومعالج Snapdragon 8 Gen 3 وقلم S Pen المدمج. مثالي لمشتري الجملة الباحثين عن أجهزة رائدة متميزة.',
      specs: JSON.stringify([
        { key: 'Display', value: '6.8" Dynamic AMOLED, 120Hz' },
        { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
        { key: 'RAM', value: '12GB' },
        { key: 'Storage', value: '256GB / 512GB / 1TB' },
        { key: 'Main Camera', value: '200MP + 12MP + 50MP + 10MP' },
        { key: 'Battery', value: '5000mAh' },
        { key: 'OS', value: 'Android 14, One UI 6.1' },
        { key: 'Colors', value: 'Titanium Black, Gray, Violet, Orange' },
      ]),
      moq: 10,
      images: JSON.stringify(['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500']),
      status: 'active',
      featured: true,
    },
    {
      name: 'Apple iPhone 15 Pro Max',
      nameAr: 'آبل آيفون 15 برو ماكس',
      slug: 'apple-iphone-15-pro-max',
      category: 'Smartphones',
      brand: 'Apple',
      description: 'Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, 6.7-inch ProMotion display, and the most advanced iPhone camera system with 5x telephoto zoom.',
      descriptionAr: 'آبل آيفون 15 برو ماكس مع شريحة A17 Pro وتصميم تيتانيوم وشاشة ProMotion مقاس 6.7 بوصة ونظام كاميرا الآيفون الأكثر تقدماً مع زوم تيليفوتو 5x.',
      specs: JSON.stringify([
        { key: 'Display', value: '6.7" Super Retina XDR, 120Hz' },
        { key: 'Processor', value: 'A17 Pro' },
        { key: 'Storage', value: '256GB / 512GB / 1TB' },
        { key: 'Main Camera', value: '48MP + 12MP + 12MP' },
        { key: 'Battery', value: '4422mAh' },
        { key: 'OS', value: 'iOS 17' },
        { key: 'Build', value: 'Titanium frame, textured matte glass' },
      ]),
      moq: 5,
      images: JSON.stringify(['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500']),
      status: 'active',
      featured: true,
    },
    {
      name: 'Xiaomi 14 Ultra',
      nameAr: 'شاومي 14 الترا',
      slug: 'xiaomi-14-ultra',
      category: 'Smartphones',
      brand: 'Xiaomi',
      description: 'Xiaomi 14 Ultra with Leica quad camera system, 5000mAh battery with 90W fast charging, Snapdragon 8 Gen 3, and 6.73-inch LTPO AMOLED display.',
      descriptionAr: 'شاومي 14 الترا مع نظام كاميرا رباعي Leica وبطارية 5000 مللي أمبير مع شحن سريع 90 واط ومعالج Snapdragon 8 Gen 3 وشاشة LTPO AMOLED مقاس 6.73 بوصة.',
      specs: JSON.stringify([
        { key: 'Display', value: '6.73" LTPO AMOLED, 120Hz' },
        { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
        { key: 'RAM', value: '16GB' },
        { key: 'Storage', value: '512GB' },
        { key: 'Camera', value: '50MP Leica Quad Camera' },
        { key: 'Battery', value: '5000mAh, 90W fast charge' },
      ]),
      moq: 20,
      images: JSON.stringify(['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500']),
      status: 'active',
      featured: true,
    },
    {
      name: 'Samsung Galaxy A55 5G',
      nameAr: 'سامسونج جالاكسي A55 5G',
      slug: 'samsung-galaxy-a55-5g',
      category: 'Smartphones',
      brand: 'Samsung',
      description: 'Samsung Galaxy A55 5G with 50MP OIS camera, 5000mAh battery, IP67 dust/water resistance, and Super AMOLED display. Great value for wholesale buyers.',
      descriptionAr: 'سامسونج جالاكسي A55 5G مع كاميرا 50 ميغابكسل OIS وبطارية 5000 مللي أمبير ومقاومة للغبار والماء IP67 وشاشة Super AMOLED. قيمة رائعة لمشتري الجملة.',
      specs: JSON.stringify([
        { key: 'Display', value: '6.6" Super AMOLED, 120Hz' },
        { key: 'Processor', value: 'Exynos 1480' },
        { key: 'RAM', value: '8GB' },
        { key: 'Storage', value: '128GB / 256GB' },
        { key: 'Camera', value: '50MP + 12MP + 5MP' },
        { key: 'Battery', value: '5000mAh, 25W fast charge' },
        { key: 'Rating', value: 'IP67' },
      ]),
      moq: 25,
      images: JSON.stringify(['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500']),
      status: 'active',
      featured: false,
    },
    {
      name: 'Huawei Pura 70 Pro',
      nameAr: 'هواوي Pura 70 Pro',
      slug: 'huawei-pura-70-pro',
      category: 'Smartphones',
      brand: 'Huawei',
      description: 'Huawei Pura 70 Pro featuring the Kirin 9010 processor, variable aperture camera with XMAGE technology, and elegant premium design.',
      descriptionAr: 'هواوي Pura 70 Pro يتميز بمعالج Kirin 9010 وكاميرا ذات فتحة متغيرة مع تقنية XMAGE وتصميم متميز أنيق.',
      specs: JSON.stringify([
        { key: 'Display', value: '6.8" LTPO OLED, 120Hz' },
        { key: 'Processor', value: 'Kirin 9010' },
        { key: 'RAM', value: '12GB' },
        { key: 'Storage', value: '256GB / 512GB' },
        { key: 'Camera', value: '50MP Variable Aperture + 48MP + 40MP' },
        { key: 'Battery', value: '5050mAh, 100W fast charge' },
      ]),
      moq: 15,
      images: JSON.stringify(['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500']),
      status: 'active',
      featured: false,
    },
    {
      name: 'Apple iPhone 15',
      nameAr: 'آبل آيفون 15',
      slug: 'apple-iphone-15',
      category: 'Smartphones',
      brand: 'Apple',
      description: 'Apple iPhone 15 with Dynamic Island, 48MP main camera, USB-C, and A16 Bionic chip. High demand among retail buyers across the GCC.',
      descriptionAr: 'آبل آيفون 15 مع Dynamic Island وكاميرا رئيسية 48 ميغابكسل وUSB-C وشريحة A16 Bionic. طلب مرتفع من المشترين في منطقة الخليج.',
      specs: JSON.stringify([
        { key: 'Display', value: '6.1" Super Retina XDR, 60Hz' },
        { key: 'Processor', value: 'A16 Bionic' },
        { key: 'Storage', value: '128GB / 256GB / 512GB' },
        { key: 'Camera', value: '48MP + 12MP' },
        { key: 'Battery', value: '3877mAh' },
        { key: 'Connector', value: 'USB-C' },
      ]),
      moq: 10,
      images: JSON.stringify(['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500']),
      status: 'active',
      featured: true,
    },
    {
      name: 'Samsung 25W USB-C Fast Charger',
      nameAr: 'شاحن سامسونج USB-C سريع 25 واط',
      slug: 'samsung-25w-usbc-charger',
      category: 'Accessories',
      brand: 'Samsung',
      description: 'Official Samsung 25W USB-C Super Fast Charging adapter. Compatible with all Samsung Galaxy devices and other USB-C devices.',
      descriptionAr: 'محول الشحن السريع الرسمي من سامسونج 25 واط USB-C. متوافق مع جميع أجهزة سامسونج جالاكسي وأجهزة USB-C الأخرى.',
      specs: JSON.stringify([
        { key: 'Power Output', value: '25W' },
        { key: 'Technology', value: 'Super Fast Charging 2.0' },
        { key: 'Connector', value: 'USB-C' },
        { key: 'Input', value: '100-240V AC' },
        { key: 'Certifications', value: 'CE, FCC, KC' },
      ]),
      moq: 100,
      images: JSON.stringify(['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500']),
      status: 'active',
      featured: false,
    },
    {
      name: 'Apple AirPods Pro (2nd Gen)',
      nameAr: 'آبل AirPods Pro الجيل الثاني',
      slug: 'apple-airpods-pro-2nd-gen',
      category: 'Accessories',
      brand: 'Apple',
      description: 'Apple AirPods Pro 2nd Generation with Active Noise Cancellation, Adaptive Audio, USB-C charging case, and up to 30 hours battery life.',
      descriptionAr: 'آبل AirPods Pro الجيل الثاني مع خاصية إلغاء الضوضاء النشط والصوت التكيفي وحافظة شحن USB-C وعمر بطارية يصل إلى 30 ساعة.',
      specs: JSON.stringify([
        { key: 'ANC', value: 'Active Noise Cancellation' },
        { key: 'Battery (buds)', value: 'Up to 6 hours' },
        { key: 'Battery (total)', value: 'Up to 30 hours' },
        { key: 'Case Connector', value: 'USB-C, Lightning, MagSafe' },
        { key: 'Chip', value: 'Apple H2' },
        { key: 'Rating', value: 'IPX4' },
      ]),
      moq: 20,
      images: JSON.stringify(['https://images.unsplash.com/photo-1606741965509-717cc3d74fde?w=500']),
      status: 'active',
      featured: true,
    },
    {
      name: 'Anker 20000mAh Power Bank',
      nameAr: 'باور بنك أنكر 20000 مللي أمبير',
      slug: 'anker-20000mah-power-bank',
      category: 'Accessories',
      brand: 'Anker',
      description: 'Anker 737 Power Bank with 140W PD charging, 20000mAh capacity, USB-C + USB-A ports, and digital display. Perfect for professionals.',
      descriptionAr: 'باور بنك أنكر 737 مع شحن PD بقدرة 140 واط وسعة 20000 مللي أمبير ومنافذ USB-C + USB-A وشاشة رقمية. مثالي للمحترفين.',
      specs: JSON.stringify([
        { key: 'Capacity', value: '20000mAh' },
        { key: 'Max Output', value: '140W USB-C' },
        { key: 'Ports', value: 'USB-C x2, USB-A x1' },
        { key: 'Display', value: 'Digital LED Display' },
        { key: 'Weight', value: '500g' },
      ]),
      moq: 50,
      images: JSON.stringify(['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500']),
      status: 'active',
      featured: false,
    },
    {
      name: 'Spigen Ultra Hybrid Case (iPhone 15 Pro)',
      nameAr: 'كفر سبيجن Ultra Hybrid لآيفون 15 برو',
      slug: 'spigen-ultra-hybrid-iphone-15-pro',
      category: 'Accessories',
      brand: 'Spigen',
      description: 'Spigen Ultra Hybrid transparent case for iPhone 15 Pro with military-grade drop protection, yellowing-resistant material, and precise cutouts.',
      descriptionAr: 'كفر Spigen Ultra Hybrid شفاف لآيفون 15 برو مع حماية من السقوط بدرجة عسكرية ومادة مقاومة للاصفرار وفتحات دقيقة.',
      specs: JSON.stringify([
        { key: 'Compatibility', value: 'iPhone 15 Pro' },
        { key: 'Material', value: 'PC + TPU' },
        { key: 'Protection', value: 'Military Grade Drop Protection' },
        { key: 'Charging', value: 'MagSafe Compatible' },
        { key: 'Colors', value: 'Crystal Clear, Frost' },
      ]),
      moq: 200,
      images: JSON.stringify(['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500']),
      status: 'active',
      featured: false,
    },
    {
      name: 'Samsung Galaxy Screen Replacement Kit (S24)',
      nameAr: 'طقم تغيير شاشة سامسونج جالاكسي S24',
      slug: 'samsung-s24-screen-replacement-kit',
      category: 'Spare Parts',
      brand: 'Samsung',
      description: 'Original Samsung Galaxy S24 AMOLED screen replacement assembly including adhesive, tools, and installation guide. OEM quality parts for professional repair shops.',
      descriptionAr: 'مجموعة استبدال شاشة AMOLED أصلية لسامسونج جالاكسي S24 تتضمن اللاصق والأدوات ودليل التركيب. قطع ذات جودة OEM لمحلات الإصلاح الاحترافية.',
      specs: JSON.stringify([
        { key: 'Part', value: 'AMOLED Screen Assembly' },
        { key: 'Compatibility', value: 'Samsung Galaxy S24' },
        { key: 'Type', value: 'OEM Original' },
        { key: 'Includes', value: 'Screen, Adhesive, Tools, Guide' },
        { key: 'Warranty', value: '3 Months' },
      ]),
      moq: 5,
      images: JSON.stringify(['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500']),
      status: 'active',
      featured: false,
    },
    {
      name: 'iPhone 15 Battery Replacement (OEM)',
      nameAr: 'بطارية آيفون 15 بديلة (OEM)',
      slug: 'iphone-15-battery-replacement-oem',
      category: 'Spare Parts',
      brand: 'Apple',
      description: 'OEM iPhone 15 battery replacement with original 3877mAh capacity. Professional repair shop supply with health certificate. Includes adhesive strips.',
      descriptionAr: 'بطارية آيفون 15 البديلة من OEM بسعة أصلية 3877 مللي أمبير. للتوريد لمحلات الإصلاح المحترفة مع شهادة الصحة. تشمل أشرطة لاصقة.',
      specs: JSON.stringify([
        { key: 'Capacity', value: '3877mAh' },
        { key: 'Voltage', value: '3.87V' },
        { key: 'Type', value: 'OEM Li-Ion' },
        { key: 'Compatibility', value: 'iPhone 15' },
        { key: 'Includes', value: 'Battery, Adhesive Strips' },
      ]),
      moq: 10,
      images: JSON.stringify(['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500']),
      status: 'active',
      featured: false,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log(`✅ ${products.length} products seeded`)

  console.log('\n🎉 Database seeded successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin login: admin@mr-ismail.ae')
  console.log('Password:    admin123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
