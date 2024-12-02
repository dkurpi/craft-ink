-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TattooGeneration" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "tattooType" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "images" TEXT[],
    "status" TEXT NOT NULL,
    "predictionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "TattooGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "TattooGeneration_createdAt_idx" ON "TattooGeneration"("createdAt");

-- CreateIndex
CREATE INDEX "TattooGeneration_userId_idx" ON "TattooGeneration"("userId");

-- AddForeignKey
ALTER TABLE "TattooGeneration" ADD CONSTRAINT "TattooGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

