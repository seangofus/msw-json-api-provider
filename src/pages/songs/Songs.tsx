import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { NavLink } from "react-router-dom";

type SongData = {
  type: "albums";
  id: string;
  attributes: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    artist: string;
    length: string;
    title: string;
  };
  relationships?: {};
};

type SongResonse = {
  data: SongData[];
  included?: [];
};

export default function Songs() {
  const queryClient = useQueryClient();

  async function getData(): Promise<SongResonse> {
    const songs = await ky.get("http://127.0.0.1:4000/v1/songs").json();
    return songs;
  }

  const { data, isLoading, isRefetching, isError } = useQuery(
    ["songs"],
    getData
  );

  const songDeleteMutation = useMutation({
    mutationFn: (id: string) => {
      return ky.delete(`http://127.0.0.1:4000/v1/songs/${id}`).json();
    },
    onSuccess: async () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      await ky.get("http://127.0.0.1:4000/v1/songs").json();
    },
  });

  if (isError) {
    return <p>Failed to load songs</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  function handleDelete(id: string) {
    songDeleteMutation.mutate(id);
  }

  return (
    <>
      <div className="mb-2">
        <h1 className="float-left text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
          Songs
        </h1>
        <NavLink
          to="/albums/create"
          className="float-right p-2 text-white transition rounded-md bg-sky-500 hover:bg-sky-600"
        >
          Create Song
        </NavLink>
      </div>
      <div className="clear-both mb-4" />

      <div className="flex flex-wrap my-2">
        <table className="min-w-full">
          <thead className="text-white rounded-lg bg-slate-800">
            <tr>
              <th className="w-1/3 px-4 py-3 text-sm font-semibold text-left uppercase rounded-l-lg">
                Title
              </th>
              <th className="w-1/3 px-4 py-3 text-sm font-semibold text-left uppercase">
                Artist
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-left uppercase">
                Length
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-left uppercase">
                Last Updated
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-left uppercase rounded-r-lg"></th>
            </tr>
          </thead>
          <tbody className="text-slate-300" key={data?.data.length}>
            {data?.data.map((song, idx) => {
              return idx % 2 === 0 ? (
                <tr key={song.id}>
                  <td className="w-1/3 px-4 py-3 text-left capitalize">
                    {song.attributes.title}
                  </td>
                  <td className="w-1/3 px-4 py-3 text-left capitalize">
                    {song.attributes.artist}
                  </td>
                  <td className="px-4 py-3 text-left">
                    {song.attributes.length}
                  </td>
                  <td className="px-4 py-3 text-left">
                    {new Date(song.attributes.updatedAt).toLocaleDateString(
                      "en-US"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a>Edit</a>
                    <a
                      className="pl-4 text-pink-500 cursor-pointer"
                      onClick={() => handleDelete(song.id)}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ) : (
                <tr
                  key={song.id}
                  className="rounded-lg shadow-lg bg-gradient-to-t from-slate-600/10 to-slate-300/10"
                >
                  <td className="w-1/3 px-4 py-3 text-left capitalize rounded-l-lg">
                    {song.attributes.title}
                  </td>
                  <td className="w-1/3 px-4 py-3 text-left capitalize">
                    {song.attributes.artist}
                  </td>
                  <td className="px-4 py-3 text-left">
                    {song.attributes.length}
                  </td>
                  <td className="px-4 py-3 text-left">
                    {new Date(song.attributes.updatedAt).toLocaleDateString(
                      "en-US"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right rounded-r-lg">
                    <a>Edit</a>
                    <a
                      className="pl-4 text-pink-500 cursor-pointer"
                      onClick={() => handleDelete(song.id)}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
