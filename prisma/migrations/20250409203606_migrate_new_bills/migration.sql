/*
  Warnings:

  - The values [MONTHLY,WEEKLY,ANNUAL] on the enum `BillFrequency` will be removed. If these variants are still used in the database, this will fail.
  - The values [RECURRING,INSTALLMENT] on the enum `BillType` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `paidInstallments` on table `bills` required. This step will fail if there are existing NULL values in that column.
  - Made the column `frequency` on table `bills` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BillFrequency_new" AS ENUM ('monthly', 'weekly', 'annual');
ALTER TABLE "bills" ALTER COLUMN "frequency" TYPE "BillFrequency_new" USING ("frequency"::text::"BillFrequency_new");
ALTER TYPE "BillFrequency" RENAME TO "BillFrequency_old";
ALTER TYPE "BillFrequency_new" RENAME TO "BillFrequency";
DROP TYPE "BillFrequency_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "BillType_new" AS ENUM ('recurring', 'installment');
ALTER TABLE "bills" ALTER COLUMN "billType" DROP DEFAULT;
ALTER TABLE "bills" ALTER COLUMN "billType" TYPE "BillType_new" USING ("billType"::text::"BillType_new");
ALTER TYPE "BillType" RENAME TO "BillType_old";
ALTER TYPE "BillType_new" RENAME TO "BillType";
DROP TYPE "BillType_old";
COMMIT;

-- AlterTable
ALTER TABLE "bills" ALTER COLUMN "paidInstallments" SET NOT NULL,
ALTER COLUMN "paidInstallments" SET DEFAULT 0,
ALTER COLUMN "billType" DROP DEFAULT,
ALTER COLUMN "frequency" SET NOT NULL;
