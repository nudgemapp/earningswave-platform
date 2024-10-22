-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningsCallTranscript" (
    "id" SERIAL NOT NULL,
    "href" VARCHAR(255) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "company_info" JSONB NOT NULL,
    "call_participants" TEXT[],
    "full_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "logo_id" INTEGER,

    CONSTRAINT "EarningsCallTranscript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logo" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EarningsCallTranscript_logo_id_key" ON "EarningsCallTranscript"("logo_id");

-- CreateIndex
CREATE UNIQUE INDEX "Email_address_key" ON "Email"("address");

-- AddForeignKey
ALTER TABLE "EarningsCallTranscript" ADD CONSTRAINT "EarningsCallTranscript_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "Logo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
