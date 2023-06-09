import ky from "ky";
import { useQuery } from "@tanstack/react-query";

import { AlbumCard } from "./components/AlbumCard";
import { NavLink } from "react-router-dom";

type AlbumData = {
  type: "albums";
  id: string;
  attributes: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    artworkUrl: string;
    releaseDate: string;
    title: string;
  };
  relationships?: {};
};

type AlbumResonse = {
  data: AlbumData[];
  included?: [];
};

export default function Albums() {
  const getData: Promise<AlbumResonse> = ky
    .get("http://127.0.0.1:4000/v1/albums")
    .json();

  const { data, isLoading, isRefetching, isError } = useQuery(
    ["albums"],
    () => getData
  );

  if (isError) {
    return <p>Failed to load songs</p>;
  }

  return (
    <>
      <div className="mb-2">
        <h1 className="float-left text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
          Albums
        </h1>
        <NavLink
          to="/albums/create"
          className="float-right p-2 text-white transition rounded-md bg-sky-500 hover:bg-sky-600"
        >
          Create Album
        </NavLink>
      </div>
      <div className="clear-both mb-4" />

      <div className="flex flex-wrap my-2">
        {data?.data.map((album) => {
          return (
            <AlbumCard key={album.id} id={album.id} {...album.attributes} />
          );
        })}
      </div>
    </>
  );
}
