import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

const ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'txt'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to upload laws
    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file || !title) {
      return NextResponse.json({ error: 'File and title are required' }, { status: 400 });
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !ALLOWED_FILE_TYPES.includes(fileExtension)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}` 
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'laws');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Extract text from file
    let extractedText = '';
    
    try {
      if (fileExtension === 'pdf') {
        const pdfData = await pdf(buffer);
        extractedText = pdfData.text;
      } else if (fileExtension === 'docx') {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } else if (fileExtension === 'txt') {
        extractedText = buffer.toString('utf-8');
      } else if (fileExtension === 'doc') {
        // For .doc files, we'll need to convert them first
        // For now, return an error
        return NextResponse.json({ 
          error: 'DOC files are not supported yet. Please convert to DOCX or PDF.' 
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      return NextResponse.json({ 
        error: 'Failed to extract text from file. Please check if the file is corrupted.' 
      }, { status: 500 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ 
        error: 'No text could be extracted from the file.' 
      }, { status: 400 });
    }

    // Parse legal document
    const parseResult = parseLegalDocument(extractedText);

    if (parseResult.errors.length > 0) {
      return NextResponse.json({ 
        error: 'Failed to parse legal document',
        details: parseResult.errors 
      }, { status: 400 });
    }

    // Create law record
    const lawData = {
      title,
      description: description || null,
      slug: generateSlug(title),
      fullText: extractedText,
      sourceFile: `/uploads/laws/${filename}`,
      fileType: fileExtension,
      fileSize: file.size,
      status: 'DRAFT' as const,
    };

    const law = await prisma.law.create({
      data: lawData,
    });

    // Create law articles
    const articlesData = parseResult.articles.map(article => ({
      lawId: law.id,
      number: article.number,
      title: article.title || null,
      text: article.text,
      slug: generateSlug(`${law.slug}-madde-${article.number}`),
      orderIndex: article.orderIndex,
    }));

    await prisma.lawArticle.createMany({
      data: articlesData,
    });

    // Fetch created law with articles
    const createdLaw = await prisma.law.findUnique({
      where: { id: law.id },
      include: {
        articles: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      law: createdLaw,
      parseResult: {
        articlesCount: parseResult.articles.length,
        warnings: parseResult.warnings,
      }
    });

  } catch (error) {
    console.error('Error uploading law:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
