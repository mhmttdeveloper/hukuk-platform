export enum CitationType {
  LAW_ARTICLE = 'LAW_ARTICLE',
  COURT_CASE = 'COURT_CASE',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  BOOK = 'BOOK',
  ARTICLE = 'ARTICLE'
}

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
