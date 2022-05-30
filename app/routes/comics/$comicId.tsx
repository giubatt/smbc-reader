import { Form, useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import { z } from "zod"
import type { Comic } from "~/models/comic.server"
import { getComic } from "~/models/comic.server"
import { getReadComics, setReadComics } from "~/utils/session.server"

type LoaderData = {
  comic: Comic
  read: boolean
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const comicId = z.string().parse(params.comicId)
  const readComics = await getReadComics(request)

  const comic = await getComic({ id: comicId })
  if (!comic) throw new Response("Not Found", { status: 404 })

  return json<LoaderData>({ comic, read: readComics.includes(comicId) })
}

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData()

  const { id, value } = z
    .object({ id: z.string(), value: z.boolean() })
    .parse({ id: body.get("id"), value: body.get("value") === "true" })

  return redirect(request.url, {
    headers: await setReadComics(request, {
      id,
      value,
    }),
  })
}

export default function ComicPage() {
  const data = useLoaderData() as LoaderData

  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-4">
      <div className="flex min-h-0 justify-center overflow-auto">
        <div>
          <img
            key={data.comic.imgUrl}
            src={data.comic.imgUrl}
            alt={data.comic.description}
          />
        </div>
      </div>

      <div className="flex flex-col justify-center gap-2">
        <span className="text-center text-sm font-bold">
          {data.comic.description}
        </span>

        <Form method="post" replace className="text-center">
          <input
            type="hidden"
            name="value"
            value={data.read ? "false" : "true"}
          />
          <input type="hidden" name="id" value={data.comic.id} />
          <button type="submit" className="rounded-lg bg-slate-200 p-2">
            {data.read ? "Set Unread" : "Set Read"}
          </button>
        </Form>
      </div>
    </div>
  )
}
