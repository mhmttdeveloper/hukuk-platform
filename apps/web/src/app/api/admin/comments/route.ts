import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Onay bekleyen yorumları getir
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const comments = await prisma.comment.findMany({
      where: {
        status: status as 'PENDING' | 'APPROVED' | 'REJECTED'
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
        },
        publication: {
          select: {
            id: true,
            title: true
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
        status: status as 'PENDING' | 'APPROVED' | 'REJECTED'
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

// Yorum durumunu güncelle (onayla/reddet)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { commentId, status, adminNote } = body

    if (!commentId || !status) {
      return NextResponse.json(
        { error: 'Eksik parametreler' },
        { status: 400 }
      )
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz durum' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        status,
        adminNote: adminNote || null,
        reviewedAt: new Date(),
        reviewedBy: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            profession: true
          }
        },
        publication: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Yorum durumu güncellenemedi:', error)
    return NextResponse.json(
      { error: 'Yorum durumu güncellenemedi' },
      { status: 500 }
    )
  }
}
