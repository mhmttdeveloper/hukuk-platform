import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { commentSchema } from '@shared/schemas'

// Yorumları getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const comments = await prisma.comment.findMany({
      where: {
        publicationId: params.id,
        status: 'APPROVED'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            profession: true,
            verifiedStatus: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const total = await prisma.comment.count({
      where: {
        publicationId: params.id,
        status: 'APPROVED'
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

// Yeni yorum ekle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = commentSchema.parse(body)

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

    // Kullanıcının daha önce yorum yapıp yapmadığını kontrol et
    const existingComment = await prisma.comment.findFirst({
      where: {
        publicationId: params.id,
        userId: session.user.id
      }
    })

    if (existingComment) {
      return NextResponse.json(
        { error: 'Bu yayına zaten yorum yapmışsınız' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        publicationId: params.id,
        userId: session.user.id,
        status: 'PENDING' // Admin onayı gerekli
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            profession: true
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error.name === 'ZodError') {
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
