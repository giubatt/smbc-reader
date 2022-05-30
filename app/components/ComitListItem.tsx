import { NavLink } from "@remix-run/react"
import type { Comic } from "~/models/comic.server"

export default function ComicListItem({
  id,
  title,
}: Pick<Comic, "id" | "title">) {
  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          `block p-2 text-sm hover:bg-red-200 ${
            isActive ? "bg-red-300 hover:bg-red-300" : ""
          }`
        }
        to={id}
        prefetch="intent"
      >
        {title}
      </NavLink>
    </li>
  )
}
