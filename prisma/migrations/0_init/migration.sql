-- CreateTable: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletePermission" BOOLEAN NOT NULL,
    "createPermission" BOOLEAN NOT NULL,
    "editPermission" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Contribution
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "docId" TEXT NOT NULL,
    "before" TEXT NOT NULL,
    "after" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Subject
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Doc
CREATE TABLE "Doc" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title_dis" TEXT NOT NULL DEFAULT '',
    "chosung" TEXT NOT NULL DEFAULT '',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "adminEditable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Tag
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "id_dis" TEXT NOT NULL DEFAULT '',
    "chosung" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Img
CREATE TABLE "Img" (
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "fileName" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "Img_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable: Many-to-Many Join Table _DocToTag
CREATE TABLE "_DocToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

---

-- Create Indices
CREATE INDEX "Doc_title_dis_idx" ON "Doc"("title_dis");
CREATE UNIQUE INDEX "Doc_id_title_key" ON "Doc"("id", "title");
CREATE UNIQUE INDEX "_DocToTag_AB_unique" ON "_DocToTag"("A", "B");
CREATE INDEX "_DocToTag_B_index" ON "_DocToTag"("B");

---

-- Add Foreign Keys
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_docId_fkey" 
    FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Doc" ADD CONSTRAINT "Doc_subjectId_fkey" 
    FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Img" ADD CONSTRAINT "Img_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_DocToTag" ADD CONSTRAINT "_DocToTag_A_fkey" 
    FOREIGN KEY ("A") REFERENCES "Doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_DocToTag" ADD CONSTRAINT "_DocToTag_B_fkey" 
    FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;