/*
  Warnings:

  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `subcategoryId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "icon",
DROP COLUMN "subcategoryId";

-- DropTable
DROP TABLE "SubCategory";
