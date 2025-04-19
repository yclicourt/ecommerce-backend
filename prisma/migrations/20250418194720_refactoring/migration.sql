/*
  Warnings:

  - You are about to drop the column `num_order` on the `Order` table. All the data in the column will be lost.
  - Added the required column `application_context` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_source` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "INTENT" AS ENUM ('CAPTURE', 'AUTHORIZE');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "num_order",
ADD COLUMN     "application_context" JSONB NOT NULL,
ADD COLUMN     "intent" "INTENT" NOT NULL DEFAULT 'CAPTURE',
ADD COLUMN     "payment_source" JSONB NOT NULL,
ADD COLUMN     "purchase_units" JSONB[];
