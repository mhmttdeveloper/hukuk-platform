import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ratingSchema } from '@shared/schemas'

// Puanlamaları getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ratings = await prisma.rating.findMany({
      where: {
        publicationId: params.id
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Ortalama puanı hesapla
    const totalRating = ratings.reduce((sum, rating) => sum + rating.score, 0)
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0

    // Puan dağılımını hesapla
    const ratingDistribution = {
      1: ratings.filter(r => r.score === 1).length,
      2: ratings.filter(r => r.score === 2).length,
      3: ratings.filter(r => r.score === 3).length,
      4: ratings.filter(r => r.score === 4).length,
      5: ratings.filter(r => r.score === 5).length
    }

    return NextResponse.json({
      ratings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      ratingDistribution
    })
  } catch (error) {
    console.error('Puanlamalar getirilemedi:', error)
    return NextResponse.json(
      { error: 'Puanlamalar getirilemedi' },
      { status: 500 }
    )
  }
}

// Puanlama ekle/güncelle
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
    const validatedData = ratingSchema.parse(body)

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

    // Kullanıcının daha önce puanlama yapıp yapmadığını kontrol et
    const existingRating = await prisma.rating.findFirst({
      where: {
        publicationId: params.id,
        userId: session.user.id
      }
    })

    let rating

    if (existingRating) {
      // Mevcut puanlamayı güncelle
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          score: validatedData.score,
          comment: validatedData.comment || null,
          updatedAt: new Date()
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
    } else {
      // Yeni puanlama ekle
      rating = await prisma.rating.create({
        data: {
          score: validatedData.score,
          comment: validatedData.comment || null,
          publicationId: params.id,
          userId: session.user.id
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
    }

    // Yayının ortalama puanını güncelle
    const allRatings = await prisma.rating.findMany({
      where: { publicationId: params.id }
    })
    
    const newAverageRating = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length

    await prisma.publication.update({
      where: { id: params.id },
      data: {
        averageRating: Math.round(newAverageRating * 10) / 10,
        ratingCount: allRatings.length
      }
    })

    return NextResponse.json(rating, { status: existingRating ? 200 : 201 })
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Puanlama eklenemedi:', error)
    return NextResponse.json(
      { error: 'Puanlama eklenemedi' },
      { status: 500 }
    )
  }
}
