-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "subscriptionStatus" TEXT NOT NULL,
    "monthlyFee" REAL NOT NULL,
    "examCount" INTEGER NOT NULL DEFAULT 0,
    "joinedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminEmail" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "joinedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sex" TEXT,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "doctorAssignedId" TEXT,
    "doctorAssignedName" TEXT,
    "examType" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "bodyPart" TEXT,
    "accessionNumber" TEXT,
    "specialtyRequired" TEXT NOT NULL,
    "dateRequested" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "clinicName" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "examImageUrl" TEXT,
    "aiDraft" TEXT,
    "finalReport" TEXT,
    "aiInsights" TEXT,
    "dicomUrl" TEXT,
    "medicalRequestUrl" TEXT,
    "studyInstanceUID" TEXT,
    "clinicalHistory" TEXT,
    "preReportTemplateId" TEXT,
    CONSTRAINT "Exam_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exam_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exam_doctorAssignedId_fkey" FOREIGN KEY ("doctorAssignedId") REFERENCES "Doctor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Exam_preReportTemplateId_fkey" FOREIGN KEY ("preReportTemplateId") REFERENCES "PreReportTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GlobalStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "totalRevenue" REAL NOT NULL,
    "totalTransferred" REAL NOT NULL,
    "platformProfit" REAL NOT NULL,
    "totalExamsProcessed" INTEGER NOT NULL,
    "activeClinics" INTEGER NOT NULL,
    "totalDoctors" INTEGER NOT NULL,
    "monthlyGrowth" REAL NOT NULL,
    "marketplaceTax" REAL NOT NULL,
    "saasRevenue" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PricingTable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modality" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feeGlobal" REAL NOT NULL DEFAULT 15.0,
    "feeDev" REAL NOT NULL DEFAULT 5.0,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PreReportTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "bodyRegion" TEXT NOT NULL,
    "complexity" INTEGER NOT NULL DEFAULT 1,
    "sections" TEXT NOT NULL,
    "variants" TEXT,
    "targetSex" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_adminEmail_key" ON "Clinic"("adminEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_crm_key" ON "Doctor"("crm");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_cpf_key" ON "Patient"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_accessionNumber_key" ON "Exam"("accessionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PricingTable_modality_urgency_key" ON "PricingTable"("modality", "urgency");
