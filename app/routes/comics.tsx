import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import ComicList from "~/components/ComicList"

import { getComicListItems } from "~/models/comic.server"
import { getReadComics } from "~/utils/session.server"
import { updateComics } from "~/utils/smbc/update.server"

type LoaderData = {
  comics: {
    smbc: {
      read: Awaited<ReturnType<typeof getComicListItems>>
      unread: Awaited<ReturnType<typeof getComicListItems>>
    }
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  updateComics()
  const readComics = await getReadComics(request)
  const smbcComics = await getComicListItems({ source: "smbc" })

  return json<LoaderData>({
    comics: {
      smbc: {
        read: smbcComics.filter((comic) => readComics.includes(comic.id)),
        unread: smbcComics.filter((comic) => !readComics.includes(comic.id)),
      },
    },
  })
}

export default function ComicsPage() {
  const data = useLoaderData() as LoaderData

  return (
    <div className="flex h-full min-h-screen flex-col">
      <main className="flex h-full bg-white">
        <div className="h-full w-60 overflow-auto border-r bg-gray-50">
          <ComicList title="SMBC" comics={data.comics.smbc} />
        </div>

        <div className="h-full flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
