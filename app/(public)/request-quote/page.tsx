import { Metadata } from 'next'
import { RFQPageClient } from '@/components/rfq/rfq-page-client'

export const metadata: Metadata = {
  title: 'Request a Quote - Wholesale Pricing',
  description: 'Submit your wholesale quote request. Get competitive bulk pricing within 24 hours.',
}

export default function RequestQuotePage() {
  return <RFQPageClient />
}
