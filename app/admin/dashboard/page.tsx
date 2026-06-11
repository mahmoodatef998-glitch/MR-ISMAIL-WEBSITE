import { prisma } from '@/lib/db'
import { Package, FileText, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [totalProducts, totalRFQs, newRFQs, activeProducts] = await Promise.all([
    prisma.product.count(),
    prisma.rFQ.count(),
    prisma.rFQ.count({ where: { status: 'new' } }),
    prisma.product.count({ where: { status: 'active' } }),
  ])

  const recentRFQs = await prisma.rFQ.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600', href: '/admin/products' },
    { label: 'Active Products', value: activeProducts, icon: TrendingUp, color: 'bg-green-50 text-green-600', href: '/admin/products' },
    { label: 'Total RFQs', value: totalRFQs, icon: FileText, color: 'bg-purple-50 text-purple-600', href: '/admin/rfqs' },
    { label: 'New RFQs', value: newRFQs, icon: Clock, color: 'bg-orange-50 text-orange-600', href: '/admin/rfqs?status=new' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent RFQs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent RFQ Submissions</h2>
          <Link href="/admin/rfqs" className="text-sm text-[#c8a96e] hover:underline">
            View All
          </Link>
        </div>
        {recentRFQs.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No RFQs yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">REF</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">CUSTOMER</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">COMPANY</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">STATUS</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">DATE</th>
                </tr>
              </thead>
              <tbody>
                {recentRFQs.map((rfq) => (
                  <tr key={rfq.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/admin/rfqs/${rfq.id}`} className="text-[#c8a96e] hover:underline font-medium">
                        {rfq.refNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-800">{rfq.customerName}</td>
                    <td className="py-3 px-4 text-gray-600">{rfq.company}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        rfq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        rfq.status === 'in_review' ? 'bg-yellow-100 text-yellow-700' :
                        rfq.status === 'quoted' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {rfq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(rfq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
