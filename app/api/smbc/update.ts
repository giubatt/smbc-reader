import Parser from "rss-parser"
import { createComic } from "~/models/comic.server"
import { z } from "zod"

const RSS_FEED = "https://www.smbc-comics.com/comic/rss"
const parser = new Parser()

const RssSchema = z.object({
  items: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
    })
  ),
})

export async function updateComics() {
  const data = await fetch(RSS_FEED)
  const rssString = await data.text()

  const feed = RssSchema.parse(await parser.parseString(rssString))

  for (const comic of feed.items) {
    try {
      await createComic({
        title: comic.title,
        url: comic.link,
        source: "smbc",
      })
    } catch {}
  }
}
