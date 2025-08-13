import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hukuk-platformu.com' },
    update: {},
    create: {
      name: 'Admin',
      surname: 'User',
      email: 'admin@hukuk-platformu.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      verifiedStatus: 'VERIFIED',
      profession: 'Sistem Yöneticisi',
      bio: 'Hukuk Platformu sistem yöneticisi',
    },
  });

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 12);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@hukuk-platformu.com' },
    update: {},
    create: {
      name: 'Editör',
      surname: 'User',
      email: 'editor@hukuk-platformu.com',
      passwordHash: editorPassword,
      role: 'EDITOR',
      verifiedStatus: 'VERIFIED',
      profession: 'Hukuk Editörü',
      bio: 'Hukuk içerik editörü',
    },
  });

  // Create author user
  const authorPassword = await bcrypt.hash('author123', 12);
  const author = await prisma.user.upsert({
    where: { email: 'author@hukuk-platformu.com' },
    update: {},
    create: {
      name: 'Yazar',
      surname: 'User',
      email: 'author@hukuk-platformu.com',
      passwordHash: authorPassword,
      role: 'AUTHOR',
      verifiedStatus: 'VERIFIED',
      profession: 'Avukat',
      bio: 'Hukuk yazarı ve avukat',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'ceza-hukuku' },
      update: {},
      create: {
        name: 'Ceza Hukuku',
        slug: 'ceza-hukuku',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'medeni-hukuk' },
      update: {},
      create: {
        name: 'Medeni Hukuk',
        slug: 'medeni-hukuk',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'is-hukuku' },
      update: {},
      create: {
        name: 'İş Hukuku',
        slug: 'is-hukuku',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'ticaret-hukuku' },
      update: {},
      create: {
        name: 'Ticaret Hukuku',
        slug: 'ticaret-hukuku',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'idari-hukuk' },
      update: {},
      create: {
        name: 'İdari Hukuk',
        slug: 'idari-hukuk',
      },
    }),
  ]);

  // Create sample publications
  const publications = await Promise.all([
    prisma.publication.upsert({
      where: { slug: 'ceza-hukukunda-kusur' },
      update: {},
      create: {
        title: 'Ceza Hukukunda Kusur Kavramı ve Uygulamadaki Önemi',
        slug: 'ceza-hukukunda-kusur',
        metaDescription: 'Ceza hukukunda kusur kavramının detaylı analizi ve güncel uygulamadaki yeri',
        categoryId: categories[0].id, // Ceza Hukuku
        authorId: author.id,
        content: `
          <h1>Ceza Hukukunda Kusur Kavramı</h1>
          <p>Ceza hukukunda kusur, suçun maddi unsurlarının yanında manevi unsurlarından biridir...</p>
          <h2>Kusurun Türleri</h2>
          <p>Kusur, kasıt ve taksir olmak üzere iki ana türde incelenir...</p>
          <h3>Kasıt</h3>
          <p>Kasıt, suçun işlenmesi arzusunun bulunmasıdır...</p>
          <h3>Taksir</h3>
          <p>Taksir, dikkat ve özen yükümlülüğüne aykırılık dolayısıyla...</p>
        `,
        seoScore: 85,
        status: 'PUBLISHED',
        allowComments: true,
        allowRatings: true,
      },
    }),
    prisma.publication.upsert({
      where: { slug: 'medeni-hukukta-sorumluluk' },
      update: {},
      create: {
        title: 'Medeni Hukukta Sorumluluk ve Tazminat Hukuku',
        slug: 'medeni-hukukta-sorumluluk',
        metaDescription: 'Medeni hukukta sorumluluk kavramı ve tazminat hukukunun temel prensipleri',
        categoryId: categories[1].id, // Medeni Hukuk
        authorId: author.id,
        content: `
          <h1>Medeni Hukukta Sorumluluk</h1>
          <p>Medeni hukukta sorumluluk, kişilerin hukuki ilişkilerinden doğan...</p>
          <h2>Sorumluluğun Türleri</h2>
          <p>Sorumluluk, sözleşmeden doğan sorumluluk ve haksız fiilden doğan sorumluluk olarak...</p>
        `,
        seoScore: 78,
        status: 'PUBLISHED',
        allowComments: true,
        allowRatings: true,
      },
    }),
  ]);

  // Create sample ratings
  await Promise.all([
    prisma.rating.upsert({
      where: {
        id: 'sample-rating-1',
      },
      update: {},
      create: {
        id: 'sample-rating-1',
        publicationId: publications[0].id,
        score: 5,
      },
    }),
    prisma.rating.upsert({
      where: {
        id: 'sample-rating-2',
      },
      update: {},
      create: {
        id: 'sample-rating-2',
        publicationId: publications[0].id,
        score: 4,
      },
    }),
  ]);

  // Create sample comments
  await Promise.all([
    prisma.comment.upsert({
      where: {
        id: 'sample-comment-1',
      },
      update: {},
      create: {
        id: 'sample-comment-1',
        publicationId: publications[0].id,
        content: 'Çok faydalı bir yazı olmuş, teşekkürler.',
        status: 'APPROVED',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`👥 Created ${await prisma.user.count()} users`);
  console.log(`📚 Created ${await prisma.category.count()} categories`);
  console.log(`📝 Created ${await prisma.publication.count()} publications`);
  console.log(`⭐ Created ${await prisma.rating.count()} ratings`);
  console.log(`💬 Created ${await prisma.comment.count()} comments`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
