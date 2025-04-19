/*
  Warnings:

  - You are about to drop the column `payment_source` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payment_source";
