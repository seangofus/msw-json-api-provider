import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <main className="bg-gradient-to-t from-slate-900 to-slate-800">
      <header className="px-40 py-5 border-b border-slate-900">
        <span className="p-2 font-bold text-white rounded-full">
          Super Cool API Demo
        </span>
      </header>
      <div className="px-40 py-10">
        <nav className="fixed w-80">
          <ul className="text-white">
            <li className="mb-2">
              <NavLink
                to="/albums"
                className={({ isActive, isPending }) =>
                  isActive
                    ? "bg-sky-500 text-white rounded-md block p-2 transition hover:bg-sky-600"
                    : isPending
                    ? "pending"
                    : "transition hover:text-sky-500 block p-2"
                }
              >
                Albums
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/songs"
                className={({ isActive, isPending }) =>
                  isActive
                    ? "bg-sky-500 text-white rounded-md block p-2 transition hover:bg-sky-600"
                    : isPending
                    ? "pending"
                    : "transition hover:text-sky-500 block p-2"
                }
              >
                Songs
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/playlists"
                className={({ isActive, isPending }) =>
                  isActive
                    ? "bg-sky-500 text-white rounded-md block p-2 transition hover:bg-sky-600"
                    : isPending
                    ? "pending"
                    : "transition hover:text-sky-500 block p-2"
                }
              >
                Playlists
              </NavLink>
            </li>
          </ul>
        </nav>
        <section className="pl-10 pr-5 ml-80">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
