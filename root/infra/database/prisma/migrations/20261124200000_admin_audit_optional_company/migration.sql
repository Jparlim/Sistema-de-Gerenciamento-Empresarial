-- Administrative events may target an administrator or invite, not a company.
ALTER TABLE "AdminAuditLog" ALTER COLUMN "companyId" DROP NOT NULL;
