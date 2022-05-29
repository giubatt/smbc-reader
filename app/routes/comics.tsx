import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react"

import { useOptionalUser } from "~/utils"
import { getComicListItems } from "~/models/comic.server"
import { updateComics } from "~/api/smbc/update"

type LoaderData = {
  comicListItems: Awaited<ReturnType<typeof getComicListItems>>
}

export const loader: LoaderFunction = async ({ request }) => {
  updateComics()
  const comicListItems = await getComicListItems({ source: "smbc" })
  return json<LoaderData>({ comicListItems })
}

export default function ComicsPage() {
  const data = useLoaderData() as LoaderData
  const user = useOptionalUser()

  return (
    <div className="flex h-full min-h-screen flex-col">
      {user ? (
        <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
          <h1 className="text-3xl font-bold">
            <Link to=".">Comics</Link>
          </h1>
          <p>{user.email}</p>
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </Form>
        </header>
      ) : null}

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          {data.comicListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.comicListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
