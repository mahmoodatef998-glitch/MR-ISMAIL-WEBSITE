import { Metadata } from 'next'
import { AboutClient } from '@/components/about/about-client'

export const metadata: Metadata = {
  title: 'About Us - Mr. Ismail Trading LLC',
  description: 'Learn about Mr. Ismail Trading LLC, Dubai\'s leading wholesale mobile phone and accessories supplier since 2009.',
}

export default function AboutPage() {
  return <AboutClient />
}
