import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { CitationType } from '@/types/citation'

// Yayındaki atıfları getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const citations = await prisma.citation.findMany({
      where: {
        publicationId: params.id
      },
      include: {
        law: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        lawArticle: {
          select: {
            id: true,
            number: true,
            text: true
          }
        },
        case: {
          select: {
            id: true,
            title: true,
            court: true,
            date: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(citations)
  } catch (error) {
    console.error('Atıflar getirilemedi:', error)
    return NextResponse.json(
      { error: 'Atıflar getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni atıf ekle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Sadece editör ve admin atıf ekleyebilir
    if (!['ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Atıf ekleme yetkiniz bulunmamaktadır' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const createCitationSchema = z.object({
      type: z.nativeEnum(CitationType),
      reference: z.string().min(1, 'Referans boş olamaz'),
      description: z.string().optional(),
      url: z.string().url().optional()
    })
    
    const validatedData = createCitationSchema.parse(body)

    // Yayının var olup olmadığını kontrol et
    const publication = await prisma.publication.findUnique({
      where: { id: params.id }
    })

    if (!publication) {
      return NextResponse.json(
        { error: 'Yayın bulunamadı' },
        { status: 404 }
      )
    }

    const citation = await prisma.citation.create({
      data: {
        ...validatedData,
        publicationId: params.id
      },
      include: {
        law: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        lawArticle: {
          select: {
            id: true,
            number: true,
            text: true
          }
        },
        case: {
          select: {
            id: true,
            title: true,
            court: true,
            date: true
          }
        }
      }
    })

    return NextResponse.json(citation, { status: 201 })
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Atıf eklenemedi:', error)
    return NextResponse.json(
      { error: 'Atıf eklenemedi' },
      { status: 500 }
    )
  }
}
