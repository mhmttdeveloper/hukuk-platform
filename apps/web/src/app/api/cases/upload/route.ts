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

    // Check if user has permission to upload cases
    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const court = formData.get('court') as string;
    const caseNumber = formData.get('caseNumber') as string;
    const date = formData.get('date') as string;

    if (!file || !title || !court || !date) {
      return NextResponse.json({ error: 'File, title, court, and date are required' }, { status: 400 });
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

    // Validate date
    const caseDate = new Date(date);
    if (isNaN(caseDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'cases');
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

    // Create case record
    const caseData = {
      title,
      court,
      caseNumber: caseNumber || null,
      date: caseDate,
      text: extractedText,
      sourceFile: `/uploads/cases/${filename}`,
      fileType: fileExtension,
      fileSize: file.size,
      status: 'DRAFT' as const,
    };

    const courtCase = await prisma.case.create({
      data: caseData,
    });

    return NextResponse.json({
      success: true,
      case: courtCase,
      textLength: extractedText.length,
      wordCount: extractedText.split(/\s+/).length,
    });

  } catch (error) {
    console.error('Error uploading case:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
