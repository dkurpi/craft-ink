/*
  Warnings:

  - A unique constraint covering the columns `[predictionId]` on the table `TattooGeneration` will be added. If there are existing duplicate values, this will fail.
  - Made the column `predictionId` on table `TattooGeneration` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TattooGeneration" ALTER COLUMN "predictionId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TattooGeneration_predictionId_key" ON "TattooGeneration"("predictionId");
