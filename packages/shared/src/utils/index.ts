// Utility functions for YargıTam

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate SEO score based on various factors
 */
export function calculateSEOScore(data: {
  title: string;
  metaDescription: string;
  content: string;
  hasFeaturedImage: boolean;
  wordCount: number;
}): number {
  let score = 0;
  
  // Title length (50-60 characters is optimal)
  if (data.title.length >= 50 && data.title.length <= 60) {
    score += 20;
  } else if (data.title.length >= 30 && data.title.length <= 70) {
    score += 15;
  } else {
    score += 5;
  }
  
  // Meta description length (150-160 characters is optimal)
  if (data.metaDescription.length >= 150 && data.metaDescription.length <= 160) {
    score += 20;
  } else if (data.metaDescription.length >= 120 && data.metaDescription.length <= 180) {
    score += 15;
  } else {
    score += 5;
  }
  
  // Content length (minimum 300 words recommended)
  if (data.wordCount >= 300) {
    score += 20;
  } else if (data.wordCount >= 200) {
    score += 15;
  } else {
    score += 5;
  }
  
  // Featured image
  if (data.hasFeaturedImage) {
    score += 20;
  }
  
  // Content quality indicators
  const hasHeadings = /\b(h[1-6])\b/i.test(data.content);
  const hasLinks = /\b(a\s+href)\b/i.test(data.content);
  const hasLists = /\b(ul|ol|li)\b/i.test(data.content);
  
  if (hasHeadings) score += 10;
  if (hasLinks) score += 5;
  if (hasLists) score += 5;
  
  return Math.min(score, 100);
}

/**
 * Extract word count from HTML content
 */
export function getWordCount(htmlContent: string): number {
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  return textContent.trim().split(/\s+/).length;
}

/**
 * Generate table of contents from HTML content
 */
export function generateTOC(htmlContent: string): Array<{ level: number; text: string; id: string }> {
  const headings = htmlContent.match(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi);
  if (!headings) return [];
  
  return headings.map((heading, index) => {
    const levelMatch = heading.match(/<h([1-6])/i);
    const textMatch = heading.match(/>([^<]+)</);
    
    const level = levelMatch ? parseInt(levelMatch[1]) : 1;
    const text = textMatch ? textMatch[1].trim() : `Heading ${index + 1}`;
    const id = generateSlug(text);
    
    return { level, text, id };
  });
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize HTML content for security
 */
export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Generate random string for IDs
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
