import ky from "ky";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

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
  data: AlbumData;
  included?: [];
};

export default function AlbumDetail() {
  const { id } = useParams();
  const getData: Promise<AlbumResonse> = ky
    .get(`http://127.0.0.1:4000/v1/albums/${id}`)
    .json();

  const { data, isLoading, isRefetching, isError } = useQuery(
    ["albums", id],
    () => getData
  );
  return (
    <div className="my-2">
      <h1 className="mb-4 font-bold text-transparent uppercase text-8xl bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
        {data?.data.attributes.title}
      </h1>
      <div className="relative">
        <div className="absolute w-full h-full rounded-xl bg-gradient-to-r from-sky-700/60 to-purple-300/60" />
        <img
          src={`${data?.data.attributes.artworkUrl}?random=${Math.round(
            Math.random() * 1000
          )}`}
          alt={data?.data.attributes.title}
          className="block object-cover w-full h-full rounded-xl"
        />
      </div>
    </div>
  );
}
