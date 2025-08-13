import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getOGImageTemplate, truncateText, calculateTextDimensions } from '@hukuk-platformu/shared';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from query string
    const title = searchParams.get('title') || 'Hukuk Platformu';
    const subtitle = searchParams.get('subtitle') || '';
    const author = searchParams.get('author') || '';
    const category = searchParams.get('category') || '';
    const readTime = searchParams.get('readTime') || '';
    const template = (searchParams.get('template') as 'linkedin' | 'twitter' | 'whatsapp' | 'default') || 'default';
    
    // Get template configuration
    const config = getOGImageTemplate(template);
    
    // Create SVG content
    const svgContent = generateSVG({
      title,
      subtitle,
      author,
      category,
      readTime,
      config,
    });
    
    // Convert SVG to PNG using Sharp
    const imageBuffer = await sharp(Buffer.from(svgContent))
      .png()
      .toBuffer();
    
    // Set response headers
    const response = new NextResponse(imageBuffer);
    response.headers.set('Content-Type', 'image/png');
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
    
    return response;
    
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return a fallback image
    const fallbackSvg = generateFallbackSVG();
    const fallbackBuffer = await sharp(Buffer.from(fallbackSvg))
      .png()
      .toBuffer();
    
    const response = new NextResponse(fallbackBuffer);
    response.headers.set('Content-Type', 'image/png');
    return response;
  }
}

interface SVGGenerationParams {
  title: string;
  subtitle: string;
  author: string;
  category: string;
  readTime: string;
  config: any;
}

function generateSVG({ title, subtitle, author, category, readTime, config }: SVGGenerationParams): string {
  const { width, height, backgroundColor, textColor, accentColor, titleFontSize, subtitleFontSize, authorFontSize, padding, borderRadius } = config;
  
  // Truncate text to fit
  const truncatedTitle = truncateText(title, 60);
  const truncatedSubtitle = subtitle ? truncateText(subtitle, 80) : '';
  const truncatedAuthor = author ? truncateText(author, 40) : '';
  
  // Calculate positions
  const titleY = padding + titleFontSize;
  const subtitleY = subtitle ? titleY + 40 + subtitleFontSize : titleY + 20;
  const authorY = author ? subtitleY + 40 + authorFontSize : subtitleY + 20;
  const categoryY = category ? authorY + 30 : authorY;
  const readTimeY = readTime ? categoryY + 30 : categoryY;
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.1" />
        </linearGradient>
        
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.1"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)" rx="${borderRadius}"/>
      
      <!-- Decorative elements -->
      <circle cx="${width - padding}" cy="${padding}" r="100" fill="${accentColor}" opacity="0.1"/>
      <circle cx="${padding}" cy="${height - padding}" r="80" fill="${accentColor}" opacity="0.05"/>
      
      <!-- Category badge -->
      ${category ? `
        <rect x="${padding}" y="${padding}" width="auto" height="32" fill="${accentColor}" rx="16" opacity="0.9"/>
        <text x="${padding + 16}" y="${padding + 22}" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="600">
          ${category.toUpperCase()}
        </text>
      ` : ''}
      
      <!-- Title -->
      <text x="${padding}" y="${titleY}" font-family="Arial, sans-serif" font-size="${titleFontSize}" fill="${textColor}" font-weight="bold" filter="url(#shadow)">
        ${truncatedTitle}
      </text>
      
      <!-- Subtitle -->
      ${subtitle ? `
        <text x="${padding}" y="${subtitleY}" font-family="Arial, sans-serif" font-size="${subtitleFontSize}" fill="${textColor}" opacity="0.8">
          ${truncatedSubtitle}
        </text>
      ` : ''}
      
      <!-- Author -->
      ${author ? `
        <text x="${padding}" y="${authorY}" font-family="Arial, sans-serif" font-size="${authorFontSize}" fill="${textColor}" opacity="0.7">
          Yazar: ${truncatedAuthor}
        </text>
      ` : ''}
      
      <!-- Read time -->
      ${readTime ? `
        <text x="${padding}" y="${readTimeY}" font-family="Arial, sans-serif" font-size="16" fill="${accentColor}" font-weight="600">
          ⏱️ ${readTime} dk okuma
        </text>
      ` : ''}
      
      <!-- Logo/Platform name -->
      <text x="${width - padding}" y="${height - padding}" font-family="Arial, sans-serif" font-size="18" fill="${textColor}" opacity="0.6" text-anchor="end">
        Hukuk Platformu
      </text>
    </svg>
  `;
}

function generateFallbackSVG(): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#f8fafc"/>
      <text x="600" y="315" font-family="Arial, sans-serif" font-size="48" fill="#1e293b" text-anchor="middle" dominant-baseline="middle">
        Hukuk Platformu
      </text>
      <text x="600" y="370" font-family="Arial, sans-serif" font-size="24" fill="#64748b" text-anchor="middle">
        Görsel yüklenirken hata oluştu
      </text>
    </svg>
  `;
}
