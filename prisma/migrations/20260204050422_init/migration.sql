-- AlterTable
ALTER TABLE "_DocToTag" ADD CONSTRAINT "_DocToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_DocToTag_AB_unique";
