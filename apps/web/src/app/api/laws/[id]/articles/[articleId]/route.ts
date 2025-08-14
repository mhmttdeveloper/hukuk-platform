import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; articleId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id: lawId, articleId } = params;
    const updateLawArticleSchema = z.object({
      number: z.string().min(1, 'Madde numarası boş olamaz'),
      text: z.string().min(1, 'Madde metni boş olamaz'),
      title: z.string().optional(),
      orderIndex: z.number().optional()
    });
    
    const body = await request.json();

    // Validate input
    const validatedData = updateLawArticleSchema.parse(body);

    // Check if article belongs to the specified law
    const existingArticle = await prisma.lawArticle.findFirst({
      where: {
        id: articleId,
        lawId: lawId
      }
    });

    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const article = await prisma.lawArticle.update({
      where: { id: articleId },
      data: validatedData
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating law article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; articleId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id: lawId, articleId } = params;

    // Check if article belongs to the specified law
    const existingArticle = await prisma.lawArticle.findFirst({
      where: {
        id: articleId,
        lawId: lawId
      }
    });

    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Delete related citations first
    await prisma.citation.deleteMany({
      where: { lawArticleId: articleId }
    });

    // Delete the article
    await prisma.lawArticle.delete({
      where: { id: articleId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting law article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
