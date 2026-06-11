'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FileText, Settings, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/rfqs', icon: FileText, label: 'RFQ Requests' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-[#0d1b2a] text-white flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-[#1a2f45]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#c8a96e] rounded-lg flex items-center justify-center text-[#0d1b2a] font-bold text-sm">
            MI
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">Mr. Ismail</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group',
                isActive
                  ? 'bg-[#c8a96e] text-[#0d1b2a] font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a2f45]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1a2f45]">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          target="_blank"
        >
          ← View Public Site
        </Link>
      </div>
    </aside>
  )
}
