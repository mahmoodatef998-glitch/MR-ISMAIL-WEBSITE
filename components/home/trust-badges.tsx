'use client'

import { useLanguage } from '@/hooks/use-language'

export function TrustBadges() {
  const { lang } = useLanguage()

  const badges = [
    {
      label: { en: 'Authorized Distributor', ar: 'موزع معتمد' },
      sub: { en: 'Samsung & Apple', ar: 'سامسونج وآبل' },
    },
    {
      label: { en: 'ISO 9001:2015', ar: 'ISO 9001:2015' },
      sub: { en: 'Quality Certified', ar: 'معتمد الجودة' },
    },
    {
      label: { en: 'DED Licensed', ar: 'مرخص DED' },
      sub: { en: 'Dubai, UAE', ar: 'دبي، الإمارات' },
    },
    {
      label: { en: 'TRA Approved', ar: 'معتمد TRA' },
      sub: { en: 'UAE Telecom Reg.', ar: 'هيئة الاتصالات الإمارات' },
    },
    {
      label: { en: 'Member', ar: 'عضو' },
      sub: { en: 'Dubai Chamber', ar: 'غرفة تجارة دبي' },
    },
  ]

  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs text-gray-400 uppercase tracking-wider mb-6 font-medium">
          {lang === 'en' ? 'Certifications & Partnerships' : 'الشهادات والشراكات'}
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {badges.map(({ label, sub }) => (
            <div
              key={label.en}
              className="flex flex-col items-center justify-center px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg min-w-[120px]"
            >
              <div className="w-8 h-8 bg-[#0d1b2a] rounded-full mb-2 flex items-center justify-center">
                <span className="text-[#c8a96e] text-xs font-bold">✓</span>
              </div>
              <span className="text-xs font-bold text-[#0d1b2a] text-center">{label[lang as 'en' | 'ar']}</span>
              <span className="text-xs text-gray-400 text-center">{sub[lang as 'en' | 'ar']}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
