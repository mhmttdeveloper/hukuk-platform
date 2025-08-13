import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const verifySchema = z.object({
  userId: z.string().uuid('Geçersiz kullanıcı ID'),
  verifiedStatus: z.enum(['VERIFIED', 'REJECTED'], {
    errorMap: () => ({ message: 'Geçersiz doğrulama durumu' })
  }),
  reason: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gereklidir' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = verifySchema.parse(body)
    
    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id: validatedData.userId },
      data: {
        verifiedStatus: validatedData.verifiedStatus,
        updatedAt: new Date()
      }
    })
    
    // If rejected, you might want to send an email notification
    if (validatedData.verifiedStatus === 'REJECTED' && validatedData.reason) {
      // TODO: Send rejection email with reason
      console.log(`User ${updatedUser.email} rejected: ${validatedData.reason}`)
    }
    
    // If verified, you might want to send a welcome email
    if (validatedData.verifiedStatus === 'VERIFIED') {
      // TODO: Send welcome email
      console.log(`User ${updatedUser.email} verified successfully`)
    }
    
    const { passwordHash, ...userWithoutPassword } = updatedUser
    
    return NextResponse.json({
      message: `Kullanıcı ${validatedData.verifiedStatus === 'VERIFIED' ? 'doğrulandı' : 'reddedildi'}`,
      user: userWithoutPassword
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Doğrulama sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Get pending users for admin review
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gereklidir' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'
    
    const users = await prisma.user.findMany({
      where: {
        verifiedStatus: status as 'PENDING' | 'VERIFIED' | 'REJECTED'
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        profession: true,
        bio: true,
        verifiedStatus: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ users })
    
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Kullanıcılar getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
