/*
  Warnings:

  - Added the required column `sections` to the `EarningsCallTranscript` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EarningsCallTranscript" ADD COLUMN     "contents" TEXT[],
ADD COLUMN     "sections" JSONB NOT NULL;
