import ComicListItem from "./ComitListItem"

export type ComicListProps = {
  title: string
  comics: {
    read: { id: string; title: string }[]
    unread: { id: string; title: string }[]
  }
}

export default function ComicList({ title, comics }: ComicListProps) {
  return (
    <details open className="bg-red-50">
      <summary className="cursor-pointer p-2 font-bold text-red-500">
        {title}
      </summary>

      <div className="pl-4">
        <details open className="cursor-pointer text-gray-800">
          <summary>Unread</summary>
          <div className="pl-4">
            {comics.unread.length === 0 ? (
              <p className="p-2">No comics left to read</p>
            ) : (
              <ul>
                {comics.unread.map((comic) => (
                  <ComicListItem key={comic.id} {...comic}></ComicListItem>
                ))}
              </ul>
            )}
          </div>
        </details>
        <details className="cursor-pointer text-gray-800">
          <summary>Read</summary>
          <div className="pl-4">
            {comics.read.length === 0 ? (
              <p className="p-2">No comics read</p>
            ) : (
              <ul>
                {comics.read.map((comic) => (
                  <ComicListItem key={comic.id} {...comic}></ComicListItem>
                ))}
              </ul>
            )}
          </div>
        </details>
      </div>
    </details>
  )
}
