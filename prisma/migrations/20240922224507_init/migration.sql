-- CreateTable
CREATE TABLE "Onboarding" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "documentoFoto" TEXT,
    "selfie" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Onboarding_pkey" PRIMARY KEY ("id")
);
