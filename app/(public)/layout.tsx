import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/ui/whatsapp-button'
import { ScrollProgress } from '@/components/ui/scroll-progress'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
