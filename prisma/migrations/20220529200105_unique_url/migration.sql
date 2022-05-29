/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Comic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comic_url_key" ON "Comic"("url");
