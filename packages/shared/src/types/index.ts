// User types
export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: UserRole;
  verifiedStatus: VerificationStatus;
  profession: string;
  bio?: string;
  socialLinks?: SocialLinks;
  contactInfo?: ContactInfo;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  AUTHOR = 'AUTHOR',
  MEMBER = 'MEMBER'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface ContactInfo {
  phone?: string;
  address?: string;
  city?: string;
}

// Publication types
export interface Publication {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  categoryId: string;
  authorId: string;
  content: string;
  featuredImage?: string;
  seoScore: number;
  status: PublicationStatus;
  allowComments: boolean;
  allowRatings: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  PUBLISHED = 'PUBLISHED',
  UPDATED = 'UPDATED'
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Rating and Comment types
export interface Rating {
  id: string;
  publicationId: string;
  userId?: string;
  score: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  publicationId: string;
  userId?: string;
  content: string;
  createdAt: Date;
  status: CommentStatus;
}

export enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Law and Case types
export interface Law {
  id: string;
  title: string;
  slug: string;
  description?: string;
  fullText: string;
  sourceFile?: string;
  fileType?: string;
  fileSize?: number;
  status: LawStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  articles?: LawArticle[];
}

export interface LawArticle {
  id: string;
  lawId: string;
  number: string;
  title?: string;
  text: string;
  slug: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  law?: Law;
}

export interface Case {
  id: string;
  title: string;
  court: string;
  caseNumber?: string;
  date: Date;
  text: string;
  sourceFile?: string;
  fileType?: string;
  fileSize?: number;
  status: CaseStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum LawStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum CaseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

// Reference types
export interface Reference {
  id: string;
  type: ReferenceType;
  label: string;
  linkedId?: string;
  createdAt: Date;
}

export enum ReferenceType {
  LAW = 'LAW',
  CASE = 'CASE'
}

// Citation types
export interface Citation {
  id: string;
  publicationId: string;
  type: CitationType;
  title: string;
  description?: string;
  url?: string;
  lawId?: string;
  lawArticleId?: string;
  caseId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CitationType {
  LAW_ARTICLE = 'LAW_ARTICLE',
  COURT_CASE = 'COURT_CASE',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  BOOK = 'BOOK',
  ARTICLE = 'ARTICLE'
}

// Extended Publication interface with citations
export interface PublicationWithCitations extends Publication {
  citations?: Citation[];
}

// File Upload Types
export interface FileUpload {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
}

export interface TextParseResult {
  articles: ParsedArticle[];
  errors: ParseError[];
  warnings: ParseWarning[];
}

export interface ParsedArticle {
  number: string;
  title?: string;
  text: string;
  orderIndex: number;
  confidence: number;
}

export interface ParseError {
  line: number;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

export interface ParseWarning {
  line: number;
  message: string;
  suggestion: string;
}

// OG Image Generation Types
export interface OGImageConfig {
  title: string;
  subtitle?: string;
  author?: string;
  category?: string;
  readTime?: number;
  template: 'linkedin' | 'twitter' | 'whatsapp' | 'default';
  width: number;
  height: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export interface OGImageResult {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  size: number;
}

export interface OGImageTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  titleFontSize: number;
  subtitleFontSize: number;
  authorFontSize: number;
  padding: number;
  borderRadius: number;
}
