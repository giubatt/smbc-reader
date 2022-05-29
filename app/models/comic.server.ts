import type { Comic } from "@prisma/client"

import { prisma } from "~/db.server"

export type { Comic } from "@prisma/client"

export function getComic({ id }: Pick<Comic, "id">) {
  return prisma.comic.findFirst({
    where: { id },
  })
}

export function getComicListItems({ source }: Pick<Comic, "source">) {
  return prisma.comic.findMany({
    where: { source },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  })
}

export function createComic({
  url,
  title,
  source,
}: Pick<Comic, "url" | "title" | "source">) {
  return prisma.comic.create({
    data: {
      title,
      url,
      source,
    },
  })
}

export function deleteComic({ id }: Pick<Comic, "id">) {
  return prisma.comic.deleteMany({
    where: { id },
  })
}
