/*
  Warnings:

  - Added the required column `source` to the `Comic` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Comic" ("createdAt", "id", "title", "updatedAt", "url") SELECT "createdAt", "id", "title", "updatedAt", "url" FROM "Comic";
DROP TABLE "Comic";
ALTER TABLE "new_Comic" RENAME TO "Comic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
