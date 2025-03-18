-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "method_payment" SET DEFAULT 'CARD_CREDIT';

-- AlterTable
ALTER TABLE "Send" ALTER COLUMN "method_send" SET DEFAULT 'MESSAGING_FREE';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
