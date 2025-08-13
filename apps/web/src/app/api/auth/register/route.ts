import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  surname: z.string().min(2, 'Soyisim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
  profession: z.string().min(2, 'Meslek bilgisi giriniz'),
  bio: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal(''))
  }).optional(),
  contactInfo: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email,
        passwordHash: hashedPassword,
        profession: validatedData.profession,
        bio: validatedData.bio,
        socialLinks: validatedData.socialLinks,
        contactInfo: validatedData.contactInfo,
        role: 'MEMBER',
        verifiedStatus: 'PENDING'
      }
    })
    
    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user
    
    return NextResponse.json({
      message: 'Kullanıcı başarıyla oluşturuldu. Hesabınız admin tarafından onaylandıktan sonra giriş yapabilirsiniz.',
      user: userWithoutPassword
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Kayıt sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}
