-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdById" TEXT;

-- CreateIndex
CREATE INDEX "Product_createdById_idx" ON "Product"("createdById");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
