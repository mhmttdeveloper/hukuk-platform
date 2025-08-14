import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status && status !== 'ALL') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.law.count({ where });

    // Get laws with pagination
    const laws = await prisma.law.findMany({
      where,
      include: {
        articles: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      laws,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching laws:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const createLawSchema = z.object({
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
    const validatedData = createLawSchema.parse(body);

    const law = await prisma.law.create({
      data: validatedData,
      include: {
        articles: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    return NextResponse.json(law, { status: 201 });
  } catch (error) {
    console.error('Error creating law:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
