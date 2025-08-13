import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mahkeme kararlarını getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const court = searchParams.get('court') || ''
    const skip = (page - 1) * limit

    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { text: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        court ? { court: { contains: court, mode: 'insensitive' } } : {}
      ]
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        orderBy: {
          date: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.case.count({ where })
    ])

    return NextResponse.json({
      cases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Mahkeme kararları getirilemedi:', error)
    return NextResponse.json(
      { error: 'Mahkeme kararları getirilemedi' },
      { status: 500 }
    )
  }
}
