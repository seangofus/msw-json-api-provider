import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.tsx";
import "./index.css";
import Layout from "./pages/Layout.tsx";

import Albums from "./pages/albums/Albums.tsx";
import AlbumDetail from "./pages/albums/AlbumDetail.tsx";
import AlbumCreate from "./pages/albums/AlbumCreate.tsx";
import AlbumEdit from "./pages/albums/AlbumEdit.tsx";

import Songs from "./pages/songs/Songs.tsx";
import SongCreate from "./pages/songs/SongCreate.tsx";
import SongEdit from "./pages/songs/SongEdit.tsx";

import Playlists from "./pages/playlists/Playlists.tsx";
import PlaylistCreate from "./pages/playlists/PlaylistCreate.tsx";
import PlaylistEdit from "./pages/playlists/PlaylistEdit.tsx";

if (import.meta.env.VITE_ENABLE_MSW === "true") {
  const module = await import("./mocks/browsers");
  const worker = module.worker;
  worker.start();
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { element: <Albums />, index: true },
      {
        path: "albums",
        element: <Albums />,
      },
      {
        path: "albums/:id",
        element: <AlbumDetail />,
      },
      {
        path: "albums/create",
        element: <AlbumCreate />,
      },
      {
        path: "albums/edit/:id",
        element: <AlbumEdit />,
      },
      { path: "songs", element: <Songs /> },
      { path: "songs/create", element: <SongCreate /> },
      {
        path: "songs/edit/:id",
        element: <SongEdit />,
      },
      { path: "playlists", element: <Playlists /> },
      { path: "playlists/create", element: <PlaylistCreate /> },
      {
        path: "playlists/edit/:id",
        element: <PlaylistEdit />,
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
