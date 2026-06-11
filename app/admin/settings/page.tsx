import { prisma } from '@/lib/db'
import { AdminSettingsClient } from '@/components/admin/admin-settings-client'

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany()
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return <AdminSettingsClient settings={settingsMap} />
}
