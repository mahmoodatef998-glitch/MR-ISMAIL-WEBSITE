import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false },
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#c8a96e] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#0d1b2a] font-bold text-2xl">
            MI
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Mr. Ismail Trading LLC</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
