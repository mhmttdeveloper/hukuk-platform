import { z } from 'zod';

// User schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR', 'MEMBER']),
  verifiedStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
  profession: z.string().min(1),
  bio: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    website: z.string().url().optional(),
  }).optional(),
  contactInfo: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Publication schemas
export const publicationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  metaDescription: z.string().min(1),
  categoryId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().min(1),
  featuredImage: z.string().optional(),
  seoScore: z.number().min(0).max(100),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'UPDATED']),
  allowComments: z.boolean(),
  allowRatings: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createPublicationSchema = publicationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Category schemas
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const createCategorySchema = categorySchema.omit({
  id: true,
});

// Rating and Comment schemas
export const ratingSchema = z.object({
  id: z.string().uuid(),
  publicationId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  score: z.number().min(1).max(5),
  createdAt: z.date(),
});

export const createRatingSchema = ratingSchema.omit({
  id: true,
  createdAt: true,
});

export const commentSchema = z.object({
  id: z.string().uuid(),
  publicationId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  content: z.string().min(1),
  createdAt: z.date(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

export const createCommentSchema = commentSchema.omit({
  id: true,
  createdAt: true,
  status: true,
});

// Law and Case schemas
export const lawSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  fullText: z.string().min(1),
  sourceFile: z.string().optional(),
  fileType: z.string().optional(),
  fileSize: z.number().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createLawSchema = lawSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLawSchema = createLawSchema.partial();

export const lawArticleSchema = z.object({
  id: z.string().uuid(),
  lawId: z.string().uuid(),
  number: z.string().min(1),
  title: z.string().optional(),
  text: z.string().min(1),
  slug: z.string().min(1),
  orderIndex: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createLawArticleSchema = lawArticleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLawArticleSchema = createLawArticleSchema.partial();

export const caseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  court: z.string().min(1),
  caseNumber: z.string().optional(),
  date: z.date(),
  text: z.string().min(1),
  sourceFile: z.string().optional(),
  fileType: z.string().optional(),
  fileSize: z.number().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCaseSchema = caseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCaseSchema = createCaseSchema.partial();

// Reference schemas
export const referenceSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['LAW', 'CASE']),
  label: z.string().min(1),
  linkedId: z.string().uuid().optional(),
  createdAt: z.date(),
});

export const createReferenceSchema = referenceSchema.omit({
  id: true,
  createdAt: true,
});

// Citation schemas
export const citationSchema = z.object({
  id: z.string().uuid(),
  publicationId: z.string().uuid(),
  type: z.enum(['LAW_ARTICLE', 'COURT_CASE', 'EXTERNAL_LINK', 'BOOK', 'ARTICLE']),
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url().optional(),
  lawId: z.string().uuid().optional(),
  lawArticleId: z.string().uuid().optional(),
  caseId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCitationSchema = citationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCitationSchema = createCitationSchema.partial();

// File Upload Schemas
export const fileUploadSchema = z.object({
  originalName: z.string().min(1),
  filename: z.string().min(1),
  mimetype: z.string().min(1),
  size: z.number().positive(),
  path: z.string().min(1),
});

export const textParseResultSchema = z.object({
  articles: z.array(z.object({
    number: z.string().min(1),
    title: z.string().optional(),
    text: z.string().min(1),
    orderIndex: z.number().int().min(0),
    confidence: z.number().min(0).max(1),
  })),
  errors: z.array(z.object({
    line: z.number().int().min(1),
    message: z.string().min(1),
    severity: z.enum(['ERROR', 'WARNING']),
  })),
  warnings: z.array(z.object({
    line: z.number().int().min(1),
    message: z.string().min(1),
    suggestion: z.string().min(1),
  })),
});
