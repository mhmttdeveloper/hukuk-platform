import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Comment şeması
const commentSchema = z.object({
  content: z.string().min(1, 'Yorum boş olamaz').max(1000, 'Yorum çok uzun'),
  parentId: z.string().optional()
})

// Yorumları getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const comments = await prisma.comment.findMany({
      where: {
        publicationId: params.id,
        parentId: null // Sadece üst seviye yorumlar
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            profession: true,
            verifiedStatus: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                surname: true,
                profession: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const total = await prisma.comment.count({
      where: {
        publicationId: params.id,
        parentId: null
      }
    })

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Yorumlar getirilemedi:', error)
    return NextResponse.json(
      { error: 'Yorumlar getirilemedi' },
      { status: 500 }
    )
  }
}

// Yorum ekle
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

    const body = await request.json()
    const { content, parentId } = commentSchema.parse(body)

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

    // Parent yorum varsa, onun var olup olmadığını kontrol et
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      })

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Üst yorum bulunamadı' },
          { status: 404 }
        )
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        publicationId: params.id,
        authorId: session.user.id,
        parentId: parentId || null,
        status: (session.user as any).role === 'ADMIN' || (session.user as any).role === 'EDITOR' ? 'APPROVED' : 'PENDING'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            profession: true,
            verifiedStatus: true
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Yorum eklenemedi:', error)
    return NextResponse.json(
      { error: 'Yorum eklenemedi' },
      { status: 500 }
    )
  }
}
