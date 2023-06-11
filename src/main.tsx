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
      { path: "playlists", element: <div>Playlists</div> },
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
