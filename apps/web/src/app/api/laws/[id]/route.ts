import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const law = await prisma.law.findUnique({
      where: { id },
      include: {
        articles: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!law) {
      return NextResponse.json({ error: 'Law not found' }, { status: 404 });
    }

    return NextResponse.json(law);
  } catch (error) {
    console.error('Error fetching law:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = params;
    const updateLawSchema = z.object({
      title: z.string().min(1, 'Başlık boş olamaz'),
      description: z.string().optional(),
      status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).default('DRAFT'),
      category: z.string().optional(),
      source: z.string().optional(),
      effectiveDate: z.string().optional(),
      repealedDate: z.string().optional()
    });
    
    const body = await request.json();

    // Validate input
    const validatedData = updateLawSchema.parse(body);

    const law = await prisma.law.update({
      where: { id },
      data: validatedData,
      include: {
        articles: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    return NextResponse.json(law);
  } catch (error) {
    console.error('Error updating law:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = params;

    // Delete related citations first
    await prisma.citation.deleteMany({
      where: { lawId: id }
    });

    // Delete law articles
    await prisma.lawArticle.deleteMany({
      where: { lawId: id }
    });

    // Delete the law
    await prisma.law.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting law:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
