-- CreateTable
CREATE TABLE "public"."Status" (
    "id" SERIAL NOT NULL,
    "isAwake" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);
