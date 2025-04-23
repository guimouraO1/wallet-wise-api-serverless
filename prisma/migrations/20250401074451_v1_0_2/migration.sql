/*
  Warnings:

  - You are about to drop the column `dueDate` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `installmentDay` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `transactions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BillType" AS ENUM ('RECURRING', 'INSTALLMENT');

-- CreateEnum
CREATE TYPE "BillFrequency" AS ENUM ('MONTHLY', 'WEEKLY', 'ANNUAL');

-- AlterTable
ALTER TABLE "bills" DROP COLUMN "dueDate",
DROP COLUMN "installmentDay",
DROP COLUMN "isPaid",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "billType" "BillType" NOT NULL DEFAULT 'RECURRING',
ADD COLUMN     "dueDay" INTEGER,
ADD COLUMN     "frequency" "BillFrequency",
ALTER COLUMN "installments" DROP NOT NULL,
ALTER COLUMN "paidInstallments" DROP NOT NULL,
ALTER COLUMN "paidInstallments" DROP DEFAULT;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
