/*
  Warnings:

  - Changed the type of `name` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoryName" AS ENUM ('SHOES', 'FASHIONS', 'ELECTRONICS');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "name" "CategoryName" NOT NULL;
