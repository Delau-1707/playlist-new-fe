import Link from "next/link";
import {
  Search,
  Clock3,
  ListMusic,
} from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/search"
          className="text-xl font-bold"
        >
          MyMusic
        </Link>

        <div className="flex gap-6 text-sm">
          <Link
            href="/search"
            className="flex items-center gap-2 hover:text-white"
          >
            <Search size={18} />
            Search
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-2 hover:text-white"
          >
            <Clock3 size={18} />
            History
          </Link>

          <Link
            href="/playlist"
            className="flex items-center gap-2 hover:text-white"
          >
            <ListMusic size={18} />
            Playlist
          </Link>
        </div>
      </div>
    </nav>
  );
}