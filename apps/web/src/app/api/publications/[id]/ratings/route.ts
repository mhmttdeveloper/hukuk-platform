import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Rating şeması
const ratingSchema = z.object({
  score: z.number().min(1).max(5),
  publicationId: z.string()
})

// Yayın puanlaması ekle/güncelle
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { score, publicationId } = ratingSchema.parse(body)

    // Kullanıcının daha önce puan verip vermediğini kontrol et
    const existingRating = await prisma.rating.findFirst({
      where: {
        publicationId,
        userId: session.user.id
      }
    })

    let rating
    if (existingRating) {
      // Mevcut puanı güncelle
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { score }
      })
    } else {
      // Yeni puan ekle
      rating = await prisma.rating.create({
        data: {
          score,
          publicationId,
          userId: session.user.id
        }
      })
    }

    // Yayının ortalama puanını hesapla
    const allRatings = await prisma.rating.findMany({
      where: { publicationId }
    })

    const averageScore = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length

    return NextResponse.json({
      rating,
      averageScore: Math.round(averageScore * 100) / 100,
      totalRatings: allRatings.length
    })
  } catch (error) {
    console.error('Puanlama eklenemedi:', error)
    return NextResponse.json(
      { error: 'Puanlama eklenemedi' },
      { status: 500 }
    )
  }
}

// Yayın puanlamalarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const publicationId = params.id

    if (!publicationId) {
      return NextResponse.json(
        { error: 'Publication ID gerekli' },
        { status: 400 }
      )
    }

    const ratings = await prisma.rating.findMany({
      where: { publicationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Puan dağılımını hesapla
    const ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    }

    ratings.forEach(rating => {
      if (rating.score >= 1 && rating.score <= 5) {
        ratingDistribution[rating.score as keyof typeof ratingDistribution]++
      }
    })

    // Ortalama puanı hesapla
    const totalScore = ratings.reduce((sum, r) => sum + r.score, 0)
    const averageRating = ratings.length > 0 ? totalScore / ratings.length : 0

    return NextResponse.json({
      ratings,
      averageRating: Math.round(averageRating * 100) / 100,
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
