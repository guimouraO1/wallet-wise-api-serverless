-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
