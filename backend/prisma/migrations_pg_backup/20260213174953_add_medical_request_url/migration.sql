-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "subscriptionStatus" TEXT NOT NULL,
    "monthlyFee" DOUBLE PRECISION NOT NULL,
    "examCount" INTEGER NOT NULL DEFAULT 0,
    "joinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminEmail" TEXT NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "joinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sex" TEXT,
    "clinicId" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
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
    "dateRequested" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
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

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalStats" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "totalTransferred" DOUBLE PRECISION NOT NULL,
    "platformProfit" DOUBLE PRECISION NOT NULL,
    "totalExamsProcessed" INTEGER NOT NULL,
    "activeClinics" INTEGER NOT NULL,
    "totalDoctors" INTEGER NOT NULL,
    "monthlyGrowth" DOUBLE PRECISION NOT NULL,
    "marketplaceTax" DOUBLE PRECISION NOT NULL,
    "saasRevenue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GlobalStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingTable" (
    "id" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL,
    "feeGlobal" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "feeDev" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreReportTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "bodyRegion" TEXT NOT NULL,
    "complexity" INTEGER NOT NULL DEFAULT 1,
    "sections" JSONB NOT NULL,
    "variants" JSONB,
    "targetSex" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreReportTemplate_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_doctorAssignedId_fkey" FOREIGN KEY ("doctorAssignedId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_preReportTemplateId_fkey" FOREIGN KEY ("preReportTemplateId") REFERENCES "PreReportTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
