/*
  Warnings:

  - You are about to drop the column `userId` on the `bills` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `bills` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bills" DROP CONSTRAINT "bills_userId_fkey";

-- AlterTable
ALTER TABLE "bills" DROP COLUMN "userId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
