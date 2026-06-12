'use client'

import { useLanguage } from '@/hooks/use-language'

const BRANDS = [
  'Samsung', 'Apple', 'Huawei', 'Xiaomi', 'OPPO', 'Vivo',
  'OnePlus', 'Realme', 'Nokia', 'Motorola', 'Sony', 'LG',
]

export function BrandsStrip() {
  const { lang } = useLanguage()

  return (
    <div className="bg-[#030810] border-y border-[#c8a96e]/8 py-5 overflow-hidden">
      <p className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.25em] mb-4">
        {lang === 'en' ? 'Authorized distributor for leading brands' : 'موزع معتمد للعلامات التجارية الرائدة'}
      </p>
      <div className="relative flex">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#030810] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#030810] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-10 whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs font-bold text-gray-400 shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e]/50 inline-block" />
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
