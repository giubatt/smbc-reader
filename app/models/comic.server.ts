import type { Comic } from "@prisma/client"

import { prisma } from "~/utils/db.server"

export type { Comic } from "@prisma/client"

export function getComic({ id }: Pick<Comic, "id">) {
  return prisma.comic.findFirst({
    where: { id },
  })
}

export function getComicListItems({ source }: Pick<Comic, "source">) {
  return prisma.comic.findMany({
    where: { source },
    select: {
      id: true,
      title: true,
      description: true,
      imgUrl: true,
      url: true,
    },
    orderBy: { publishedAt: "desc" },
  })
}

export function createComic({
  url,
  title,
  source,
  imgUrl,
  description,
  publishedAt,
}: Pick<
  Comic,
  "url" | "title" | "source" | "imgUrl" | "description" | "publishedAt"
>) {
  return prisma.comic.create({
    data: {
      title,
      url,
      source,
      imgUrl,
      description,
      publishedAt,
    },
  })
}

export function deleteComic({ id }: Pick<Comic, "id">) {
  return prisma.comic.deleteMany({
    where: { id },
  })
}
