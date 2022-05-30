import { createCookieSessionStorage, redirect, json } from "@remix-run/node"
import invariant from "tiny-invariant"
import type { Comic } from "~/models/comic.server"

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set")

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
})

const READ_COMICS_KEY = "read_comics"

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie")
  return sessionStorage.getSession(cookie)
}

export async function getReadComics(request: Request): Promise<Comic["id"][]> {
  const session = await getSession(request)
  const readComics = session.get(READ_COMICS_KEY)
  if (readComics === undefined) return []
  return readComics
}

export async function setReadComics(
  request: Request,
  { id, value }: { id: Comic["id"]; value: boolean }
) {
  const readComics = await getReadComics(request)
  const session = await getSession(request)
  const readComicsSet = new Set(readComics)
  if (value) readComicsSet.add(id)
  else readComicsSet.delete(id)

  session.set(READ_COMICS_KEY, [...readComicsSet])

  return {
    "Set-Cookie": await sessionStorage.commitSession(session, {
      maxAge: 30 * 24 * 60 * 60,
    }),
  }
}
