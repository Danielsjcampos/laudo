-- CreateTable
CREATE TABLE "VerifiedCrm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "crm" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT,
    "status" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "lastVerified" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifiedCrm_crm_uf_key" ON "VerifiedCrm"("crm", "uf");
