import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import { z } from "zod"
import { getComic } from "~/models/comic.server"
import puppeteer from "puppeteer"

type LoaderData = {
  comic: Awaited<ReturnType<typeof getComic>> & {
    imgUrl: string
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const comicId = z.string().parse(params.comicId)

  const comic = await getComic({ id: comicId })
  if (!comic) throw new Response("Not Found", { status: 404 })

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(comic.url)
  await page.screenshot({ path: "example.png" })

  return json<LoaderData>({
    comic: {
      ...comic,
      imgUrl: "",
    },
  })
}

export default function ComicPage() {
  const data = useLoaderData() as LoaderData

  return <iframe title={data.comic?.title} src={data.comic?.url} />
}
