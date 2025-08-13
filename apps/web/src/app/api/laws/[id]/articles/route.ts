import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Kanun maddelerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articles = await prisma.lawArticle.findMany({
      where: {
        lawId: params.id
      },
      orderBy: {
        number: 'asc'
      }
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Kanun maddeleri getirilemedi:', error)
    return NextResponse.json(
      { error: 'Kanun maddeleri getirilemedi' },
      { status: 500 }
    )
  }
}
