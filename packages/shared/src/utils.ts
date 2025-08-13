import { ParsedArticle, ParseError, ParseWarning } from './types';

/**
 * Parse legal document text and extract articles
 */
export function parseLegalDocument(text: string): {
  articles: ParsedArticle[];
  errors: ParseError[];
  warnings: ParseWarning[];
} {
  const articles: ParsedArticle[] = [];
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];
  
  // Split text into lines
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentArticle: Partial<ParsedArticle> | null = null;
  let lineIndex = 0;
  
  // Common article patterns
  const articlePatterns = [
    /^(?:Madde|MADDE|Article|ARTICLE)\s*(\d+[a-zA-Z]?)/i,
    /^(\d+[a-zA-Z]?)\s*[-–—]\s*(.+)/,
    /^(\d+[a-zA-Z]?)\s*\.\s*(.+)/,
    /^(\d+[a-zA-Z]?)\s*\)\s*(.+)/,
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    
    // Check if line contains article start
    let articleMatch: RegExpMatchArray | null = null;
    let patternIndex = 0;
    
    for (const pattern of articlePatterns) {
      const match = line.match(pattern);
      if (match) {
        articleMatch = match;
        patternIndex = articlePatterns.indexOf(pattern);
        break;
      }
    }
    
    if (articleMatch) {
      // Save previous article if exists
      if (currentArticle && currentArticle.number && currentArticle.text) {
        articles.push({
          number: currentArticle.number,
          title: currentArticle.title,
          text: currentArticle.text.trim(),
          orderIndex: articles.length,
          confidence: calculateConfidence(currentArticle.text, patternIndex),
        });
      }
      
      // Start new article
      const articleNumber = articleMatch[1];
      const articleTitle = articleMatch[2] || '';
      
      currentArticle = {
        number: articleNumber,
        title: articleTitle || undefined,
        text: articleTitle,
      };
      
      // Validate article number format
      if (!/^\d+[a-zA-Z]?$/.test(articleNumber)) {
        warnings.push({
          line: lineNumber,
          message: `Geçersiz madde numarası formatı: ${articleNumber}`,
          suggestion: 'Madde numarası sadece rakam ve opsiyonel harf içermelidir (örn: 1, 2a, 15)',
        });
      }
    } else if (currentArticle) {
      // Continue building current article
      if (currentArticle.text) {
        currentArticle.text += ' ' + line;
      } else {
        currentArticle.text = line;
      }
    }
  }
  
  // Add last article
  if (currentArticle && currentArticle.number && currentArticle.text) {
    articles.push({
      number: currentArticle.number,
      title: currentArticle.title,
      text: currentArticle.text.trim(),
      orderIndex: articles.length,
      confidence: calculateConfidence(currentArticle.text, 0),
    });
  }
  
  // Validation and error checking
  if (articles.length === 0) {
    errors.push({
      line: 1,
      message: 'Hiç madde bulunamadı',
      severity: 'ERROR',
    });
  }
  
  // Check for duplicate article numbers
  const articleNumbers = articles.map(a => a.number);
  const duplicates = articleNumbers.filter((num, index) => articleNumbers.indexOf(num) !== index);
  
  if (duplicates.length > 0) {
    duplicates.forEach(num => {
      errors.push({
        line: 1,
        message: `Tekrarlanan madde numarası: ${num}`,
        severity: 'ERROR',
      });
    });
  }
  
  // Check for very short articles
  articles.forEach((article, index) => {
    if (article.text.length < 10) {
      warnings.push({
        line: 1,
        message: `Madde ${article.number} çok kısa (${article.text.length} karakter)`,
        suggestion: 'Madde metnini kontrol edin ve gerekirse düzenleyin',
      });
    }
  });
  
  return { articles, errors, warnings };
}

/**
 * Calculate confidence score for parsed article
 */
function calculateConfidence(text: string, patternIndex: number): number {
  let confidence = 0.8; // Base confidence
  
  // Pattern confidence (first pattern is most reliable)
  confidence += (4 - patternIndex) * 0.05;
  
  // Text length confidence
  if (text.length > 100) confidence += 0.1;
  if (text.length > 500) confidence += 0.05;
  
  // Text quality indicators
  if (text.includes('.')) confidence += 0.02;
  if (text.includes(',')) confidence += 0.01;
  if (text.includes(';')) confidence += 0.01;
  
  // Cap at 1.0
  return Math.min(confidence, 1.0);
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ğ]/g, 'g')
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Validate file type
 */
export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get OG image template configuration
 */
export function getOGImageTemplate(template: string): OGImageTemplate {
  const templates: Record<string, OGImageTemplate> = {
    linkedin: {
      id: 'linkedin',
      name: 'LinkedIn',
      width: 1200,
      height: 630,
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      accentColor: '#0077b5',
      titleFontSize: 48,
      subtitleFontSize: 24,
      authorFontSize: 18,
      padding: 60,
      borderRadius: 12,
    },
    twitter: {
      id: 'twitter',
      name: 'Twitter/X',
      width: 1200,
      height: 675,
      backgroundColor: '#000000',
      textColor: '#ffffff',
      accentColor: '#1da1f2',
      titleFontSize: 52,
      subtitleFontSize: 28,
      authorFontSize: 20,
      padding: 80,
      borderRadius: 16,
    },
    whatsapp: {
      id: 'whatsapp',
      name: 'WhatsApp',
      width: 800,
      height: 800,
      backgroundColor: '#25d366',
      textColor: '#ffffff',
      accentColor: '#128c7e',
      titleFontSize: 36,
      subtitleFontSize: 20,
      authorFontSize: 16,
      padding: 40,
      borderRadius: 20,
    },
    default: {
      id: 'default',
      name: 'Default',
      width: 1200,
      height: 630,
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      accentColor: '#3b82f6',
      titleFontSize: 48,
      subtitleFontSize: 24,
      authorFontSize: 18,
      padding: 60,
      borderRadius: 12,
    },
  };

  return templates[template] || templates.default;
}

/**
 * Truncate text to fit within specified width
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // Try to break at word boundary
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Calculate text dimensions (approximate)
 */
export function calculateTextDimensions(text: string, fontSize: number): { width: number; height: number } {
  // Approximate character width based on font size
  const avgCharWidth = fontSize * 0.6;
  const lineHeight = fontSize * 1.2;
  
  // Simple word wrapping calculation
  const words = text.split(' ');
  let currentLine = '';
  let lines = 1;
  let maxLineWidth = 0;
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const testWidth = testLine.length * avgCharWidth;
    
    if (testWidth > 1000) { // Max width for wrapping
      lines++;
      maxLineWidth = Math.max(maxLineWidth, currentLine.length * avgCharWidth);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  maxLineWidth = Math.max(maxLineWidth, currentLine.length * avgCharWidth);
  
  return {
    width: maxLineWidth,
    height: lines * lineHeight,
  };
}
