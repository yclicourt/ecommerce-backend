-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "statusTransactions" "StatusOrder" NOT NULL DEFAULT 'CREATED',
    "purchase_units" JSONB[],
    "payer" JSONB NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
