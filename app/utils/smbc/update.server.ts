import Parser from "rss-parser"
import { createComic } from "~/models/comic.server"
import { z } from "zod"
import { JSDOM } from "jsdom"
import { prisma } from "~/utils/db.server"

const RSS_FEED = "https://www.smbc-comics.com/comic/rss"
const parser = new Parser()

const RssSchema = z.object({
  items: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
      pubDate: z.string(),
    })
  ),
})

export async function updateComics() {
  const data = await fetch(RSS_FEED)
  const rssString = await data.text()

  const feed = RssSchema.parse(await parser.parseString(rssString))

  const promises = feed.items.map(async (comic) => {
    const existingComig = await prisma.comic.findUnique({
      where: {
        url: comic.link,
      },
    })
    if (existingComig) return

    const page = await fetch(comic.link)
    const html = await page.text()

    const dom = new JSDOM(html)

    const image = dom.window.document.querySelector("#cc-comic")
    const src = z.string().parse(image?.getAttribute("src"))
    const title = z.string().parse(image?.getAttribute("title"))

    try {
      await createComic({
        title: comic.title.replace("Saturday Morning Breakfast Cereal - ", ""),
        url: comic.link,
        source: "smbc",
        imgUrl: src,
        description: title,
        publishedAt: new Date(comic.pubDate),
      })
    } catch {}
  })

  await Promise.all(promises)
}
