import { RFQItem } from '@/types'

interface PDFData {
  refNumber: string
  customerName: string
  company: string
  email: string
  phone: string
  country: string
  city: string
  items: RFQItem[]
  message?: string
  date: string
  validUntil: string
}

export async function generateRFQPDF(data: PDFData): Promise<Blob> {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20

  // Header background
  doc.setFillColor(13, 27, 42) // #0d1b2a
  doc.rect(0, 0, pageWidth, 45, 'F')

  // Company Name
  doc.setTextColor(200, 169, 110) // #c8a96e gold
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Mr. Ismail Trading LLC', margin, 18)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 180)
  doc.text('Mobile Phones & Accessories | Dubai, UAE', margin, 26)
  doc.text('Tel: +971 50 123 4567 | info@mr-ismail-trading.ae', margin, 32)
  doc.text('www.mr-ismail-trading.ae', margin, 38)

  // Quote label on right
  doc.setTextColor(200, 169, 110)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('QUOTE REQUEST', pageWidth - margin, 18, { align: 'right' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 200, 200)
  doc.text(`Ref: ${data.refNumber}`, pageWidth - margin, 26, { align: 'right' })
  doc.text(`Date: ${data.date}`, pageWidth - margin, 32, { align: 'right' })
  doc.text(`Valid Until: ${data.validUntil}`, pageWidth - margin, 38, { align: 'right' })

  let y = 55

  // Customer Details section
  doc.setFillColor(248, 244, 238)
  doc.roundedRect(margin, y, pageWidth - margin * 2, 44, 3, 3, 'F')
  doc.setDrawColor(200, 169, 110)
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, y, pageWidth - margin * 2, 44, 3, 3, 'S')

  doc.setTextColor(13, 27, 42)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('CUSTOMER INFORMATION', margin + 5, y + 8)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)

  const col1 = margin + 5
  const col2 = pageWidth / 2 + 5
  y += 14

  const details = [
    ['Name:', data.customerName, 'Company:', data.company],
    ['Email:', data.email, 'Phone:', data.phone],
    ['Location:', `${data.city}, ${data.country}`, '', ''],
  ]

  details.forEach(([l1, v1, l2, v2]) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(13, 27, 42)
    doc.text(l1, col1, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(v1, col1 + 20, y)
    if (l2) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(13, 27, 42)
      doc.text(l2, col2, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(60, 60, 60)
      doc.text(v2, col2 + 22, y)
    }
    y += 8
  })

  y += 8

  // Products Table Header
  doc.setTextColor(13, 27, 42)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('REQUESTED PRODUCTS', margin, y)
  y += 6

  // Table header
  doc.setFillColor(13, 27, 42)
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'F')
  doc.setTextColor(200, 169, 110)
  doc.setFontSize(9)
  doc.text('#', margin + 3, y + 5.5)
  doc.text('Product Name', margin + 12, y + 5.5)
  doc.text('Quantity', pageWidth - margin - 50, y + 5.5)
  doc.text('Unit Price', pageWidth - margin - 25, y + 5.5)
  y += 8

  // Table rows
  data.items.forEach((item, i) => {
    const rowBg = i % 2 === 0 ? [255, 255, 255] : [248, 248, 248]
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2])
    doc.rect(margin, y, pageWidth - margin * 2, 8, 'F')

    doc.setTextColor(60, 60, 60)
    doc.setFont('helvetica', 'normal')
    doc.text(String(i + 1), margin + 3, y + 5.5)

    const name = item.productName.length > 45 ? item.productName.slice(0, 42) + '...' : item.productName
    doc.text(name, margin + 12, y + 5.5)
    doc.text(String(item.quantity), pageWidth - margin - 50, y + 5.5)
    doc.setTextColor(150, 150, 150)
    doc.text('To be confirmed', pageWidth - margin - 25, y + 5.5)
    y += 8
  })

  // Table border
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.3)
  doc.rect(margin, y - data.items.length * 8 - 8, pageWidth - margin * 2, data.items.length * 8 + 8, 'S')

  y += 10

  // Special requirements
  if (data.message) {
    doc.setFillColor(248, 244, 238)
    const msgLines = doc.splitTextToSize(data.message, pageWidth - margin * 2 - 10)
    const boxH = msgLines.length * 5 + 14
    doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'F')
    doc.setTextColor(13, 27, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('SPECIAL REQUIREMENTS:', margin + 5, y + 7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(msgLines, margin + 5, y + 13)
    y += boxH + 8
  }

  // Terms & Conditions
  y += 4
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, y, pageWidth - margin * 2, 28, 'F')
  doc.setTextColor(13, 27, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('TERMS & CONDITIONS', margin + 5, y + 6)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  const terms = [
    '• This quote request is valid for 7 days from the date above.',
    '• Actual pricing will be provided by our sales team based on quantities and current market rates.',
    '• All prices are EXW Dubai, UAE unless otherwise agreed. Payment terms are subject to credit approval.',
    '• Delivery times and shipping costs will be quoted separately.',
  ]
  terms.forEach((term, i) => {
    doc.text(term, margin + 5, y + 12 + i * 4.5)
  })

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15
  doc.setFillColor(13, 27, 42)
  doc.rect(0, footerY - 5, pageWidth, 20, 'F')
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(7)
  doc.text(
    `Mr. Ismail Trading LLC | Sheikh Zayed Road, Dubai, UAE | +971 50 123 4567 | info@mr-ismail-trading.ae`,
    pageWidth / 2,
    footerY + 3,
    { align: 'center' }
  )

  return doc.output('blob')
}
