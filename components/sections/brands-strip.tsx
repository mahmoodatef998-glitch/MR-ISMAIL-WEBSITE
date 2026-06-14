'use client'

import { useLanguage } from '@/hooks/use-language'

const BRANDS_ROW1 = [
  { name: 'Samsung',  color: '#1428A0' },
  { name: 'Apple',    color: '#555555' },
  { name: 'Huawei',   color: '#CF0A2C' },
  { name: 'Xiaomi',   color: '#FF6900' },
  { name: 'OPPO',     color: '#1D8348'  },
  { name: 'Vivo',     color: '#415FFF' },
]

const BRANDS_ROW2 = [
  { name: 'OnePlus',  color: '#F50514' },
  { name: 'Realme',   color: '#FFBF00' },
  { name: 'Nokia',    color: '#005AFF' },
  { name: 'Motorola', color: '#005B99' },
  { name: 'Sony',     color: '#000000' },
  { name: 'Honor',    color: '#C41230' },
]

function BrandPill({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm font-bold text-gray-300 shrink-0 hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white transition-all duration-200 cursor-default">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
      />
      {name}
    </span>
  )
}

export function BrandsStrip() {
  const { lang } = useLanguage()

  return (
    <div className="bg-[#030810] border-y border-[#c8a96e]/8 py-6 overflow-hidden">
      <p className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.25em] mb-5">
        {lang === 'en' ? 'Authorized distributor for leading global brands' : 'موزع معتمد للعلامات التجارية العالمية الرائدة'}
      </p>

      {/* Row 1 — left to right */}
      <div className="relative flex mb-3">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030810] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030810] to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee gap-3 whitespace-nowrap">
          {[...BRANDS_ROW1, ...BRANDS_ROW1, ...BRANDS_ROW1].map((b, i) => (
            <BrandPill key={i} name={b.name} color={b.color} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="relative flex">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030810] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030810] to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee-reverse gap-3 whitespace-nowrap">
          {[...BRANDS_ROW2, ...BRANDS_ROW2, ...BRANDS_ROW2].map((b, i) => (
            <BrandPill key={i} name={b.name} color={b.color} />
          ))}
        </div>
      </div>
    </div>
  )
}
