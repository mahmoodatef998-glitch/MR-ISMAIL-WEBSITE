'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { Session } from 'next-auth'

export function AdminHeader({ session }: { session: Session }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Admin Dashboard
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{session.user?.email}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-gray-500 hover:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}
