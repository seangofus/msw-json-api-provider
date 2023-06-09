import ky from "ky";
import { useQuery } from "react-query";

import { AlbumCard } from "./components/AlbumCard";

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
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
        Albums
      </h1>
      {isLoading ? <p>Loading...</p> : null}
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
