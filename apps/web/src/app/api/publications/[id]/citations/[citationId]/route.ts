import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Tekil atıfı getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; citationId: string } }
) {
  try {
    const citation = await prisma.citation.findUnique({
      where: {
        id: params.citationId,
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

    if (!citation) {
      return NextResponse.json(
        { error: 'Atıf bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(citation)
  } catch (error) {
    console.error('Atıf getirilemedi:', error)
    return NextResponse.json(
      { error: 'Atıf getirilemedi' },
      { status: 500 }
    )
  }
}

// Atıfı güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; citationId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Sadece editör ve admin atıf güncelleyebilir
    if (!['ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Atıf güncelleme yetkiniz bulunmamaktadır' },
        { status: 403 }
      )
    }

    const updateCitationSchema = z.object({
      type: z.enum(['LAW_ARTICLE', 'COURT_CASE', 'EXTERNAL_LINK', 'BOOK', 'OTHER']),
      reference: z.string().min(1, 'Referans boş olamaz'),
      description: z.string().optional(),
      url: z.string().url().optional()
    })
    
    const body = await request.json()
    const validatedData = updateCitationSchema.parse(body)

    const citation = await prisma.citation.update({
      where: {
        id: params.citationId,
        publicationId: params.id
      },
      data: validatedData,
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

    return NextResponse.json(citation)
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Atıf güncellenemedi:', error)
    return NextResponse.json(
      { error: 'Atıf güncellenemedi' },
      { status: 500 }
    )
  }
}

// Atıfı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; citationId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Sadece editör ve admin atıf silebilir
    if (!['ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Atıf silme yetkiniz bulunmamaktadır' },
        { status: 403 }
      )
    }

    await prisma.citation.delete({
      where: {
        id: params.citationId,
        publicationId: params.id
      }
    })

    return NextResponse.json({ message: 'Atıf başarıyla silindi' })
  } catch (error) {
    console.error('Atıf silinemedi:', error)
    return NextResponse.json(
      { error: 'Atıf silinemedi' },
      { status: 500 }
    )
  }
}
