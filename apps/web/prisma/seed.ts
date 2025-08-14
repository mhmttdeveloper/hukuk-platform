import { PrismaClient, UserRole, VerificationStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Test kullanıcıları oluştur
  const testUsers = [
    {
      name: 'Test',
      surname: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: UserRole.ADMIN,
      verifiedStatus: VerificationStatus.VERIFIED,
      profession: 'Hukuk Profesörü',
      bio: 'Test admin kullanıcısı - tüm yetkilere sahip'
    },
    {
      name: 'Test',
      surname: 'Editor',
      email: 'editor@test.com',
      password: 'editor123',
      role: UserRole.EDITOR,
      verifiedStatus: VerificationStatus.VERIFIED,
      profession: 'Avukat',
      bio: 'Test editör kullanıcısı - içerik yönetimi yetkisi'
    },
    {
      name: 'Test',
      surname: 'Author',
      email: 'author@test.com',
      password: 'author123',
      role: UserRole.AUTHOR,
      verifiedStatus: VerificationStatus.VERIFIED,
      profession: 'Hukuk Danışmanı',
      bio: 'Test yazar kullanıcısı - yayın oluşturma yetkisi'
    },
    {
      name: 'Test',
      surname: 'Member',
      email: 'member@test.com',
      password: 'member123',
      role: UserRole.MEMBER,
      verifiedStatus: VerificationStatus.VERIFIED,
      profession: 'Hukuk Öğrencisi',
      bio: 'Test üye kullanıcısı - temel yetkiler'
    }
  ]

  for (const userData of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          surname: userData.name,
          email: userData.email,
          passwordHash: hashedPassword,
          role: userData.role,
          verifiedStatus: userData.verifiedStatus,
          profession: userData.profession,
          bio: userData.bio
        }
      })
      
      console.log(`✅ Created user: ${user.email} (${user.role})`)
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`)
    }
  }

  // Test kategorileri oluştur
  const testCategories = [
    { name: 'Ceza Hukuku', slug: 'ceza-hukuku' },
    { name: 'Medeni Hukuk', slug: 'medeni-hukuk' },
    { name: 'Ticaret Hukuku', slug: 'ticaret-hukuku' },
    { name: 'İş Hukuku', slug: 'is-hukuku' },
    { name: 'Anayasa Hukuku', slug: 'anayasa-hukuku' }
  ]

  for (const categoryData of testCategories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: categoryData.slug }
    })

    if (!existingCategory) {
      const category = await prisma.category.create({
        data: categoryData
      })
      
      console.log(`✅ Created category: ${category.name}`)
    } else {
      console.log(`⏭️  Category already exists: ${categoryData.name}`)
    }
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
