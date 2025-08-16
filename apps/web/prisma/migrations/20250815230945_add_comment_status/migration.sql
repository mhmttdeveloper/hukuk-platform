/*
  Warnings:

  - You are about to drop the column `userId` on the `comments` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "references" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "linkedId" TEXT,
    "publicationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "references_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "references_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "citations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "lawId" TEXT,
    "lawArticleId" TEXT,
    "caseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "citations_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "citations_lawId_fkey" FOREIGN KEY ("lawId") REFERENCES "laws" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "citations_lawArticleId_fkey" FOREIGN KEY ("lawArticleId") REFERENCES "law_articles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "citations_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "laws" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "fullText" TEXT NOT NULL,
    "sourceFile" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "law_articles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lawId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT,
    "text" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "law_articles_lawId_fkey" FOREIGN KEY ("lawId") REFERENCES "laws" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "court" TEXT NOT NULL,
    "caseNumber" TEXT,
    "date" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "sourceFile" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicationId" TEXT NOT NULL,
    "authorId" TEXT,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "comments_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("content", "createdAt", "id", "publicationId", "status") SELECT "content", "createdAt", "id", "publicationId", "status" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "laws_slug_key" ON "laws"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "law_articles_slug_key" ON "law_articles"("slug");
