/*
  Warnings:

  - Added the required column `currency` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountAmount` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAmount` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxAmount` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "discountAmount" INTEGER NOT NULL,
ADD COLUMN     "shippingAmount" INTEGER NOT NULL,
ADD COLUMN     "taxAmount" INTEGER NOT NULL;
