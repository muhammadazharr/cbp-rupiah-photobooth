-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PrintStatus" AS ENUM ('PENDING', 'PRINTING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "WhatsappStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT NOT NULL,
    "frameColor" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL,
    "borderWidth" INTEGER NOT NULL DEFAULT 8,
    "borderRadius" INTEGER NOT NULL DEFAULT 0,
    "textLabel" TEXT,
    "textColor" TEXT NOT NULL DEFAULT '#ffffff',
    "fontFamily" TEXT NOT NULL DEFAULT 'Arial',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cssFilter" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "templateId" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "finalImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "photoNumber" INTEGER NOT NULL,
    "rawImageUrl" TEXT NOT NULL,
    "editedImageUrl" TEXT,
    "filterId" TEXT,
    "retakeCount" INTEGER NOT NULL DEFAULT 0,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Print" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" "PrintStatus" NOT NULL DEFAULT 'PENDING',
    "errorMsg" TEXT,
    "printedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Print_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsappSend" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "waLink" TEXT NOT NULL,
    "status" "WhatsappStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappSend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AppConfig_key_key" ON "AppConfig"("key");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "Filter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Print" ADD CONSTRAINT "Print_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsappSend" ADD CONSTRAINT "WhatsappSend_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
