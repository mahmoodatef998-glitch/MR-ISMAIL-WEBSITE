import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { rfqId, productId, qty } = await req.json()

    if (!rfqId || !productId || !qty || qty < 1) {
      return NextResponse.json({ success: false, error: 'Missing or invalid fields' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    if (product.stock < qty) {
      return NextResponse.json({
        success: false,
        error: `Insufficient stock. Available: ${product.stock} units`,
      }, { status: 400 })
    }

    const [updatedProduct] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: qty } },
      }),
      prisma.rFQ.update({
        where: { id: rfqId },
        data: {
          status: 'closed',
          confirmedProductId: productId,
          confirmedQty: qty,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      newStock: updatedProduct.stock,
      productName: updatedProduct.name,
    })
  } catch (err) {
    console.error('Confirm RFQ error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
