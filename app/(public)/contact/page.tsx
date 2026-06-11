import { Metadata } from 'next'
import { ContactClient } from '@/components/contact/contact-client'

export const metadata: Metadata = {
  title: 'Contact Us - Mr. Ismail Trading LLC',
  description: 'Contact our wholesale team for inquiries about mobile phones and accessories in Dubai, UAE.',
}

export default function ContactPage() {
  return <ContactClient />
}
