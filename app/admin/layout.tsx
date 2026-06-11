import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Unauthenticated: middleware handles redirect for protected pages.
  // Login page renders without the sidebar/header shell.
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader email={user.email ?? ''} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
