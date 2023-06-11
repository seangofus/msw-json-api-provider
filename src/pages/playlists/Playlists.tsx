import { CircularProgress } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { NavLink, useNavigate } from "react-router-dom";

type SongData = {
  type: "playlists";
  id: string;
  attributes: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    name: string;
  };
  relationships?: {};
};

type SongResonse = {
  data: SongData[];
  included?: [];
};

export default function Playlists() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function getData(): Promise<SongResonse> {
    const playlists = await ky.get("http://127.0.0.1:4000/v1/playlists").json();
    return playlists;
  }

  const { data, isLoading, isRefetching, isError } = useQuery(
    ["playlists"],
    getData
  );

  const songPlaylistMutation = useMutation({
    mutationFn: (id: string) => {
      return ky.delete(`http://127.0.0.1:4000/v1/playlists/${id}`).json();
    },
    onSuccess: async () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      await ky.get("http://127.0.0.1:4000/v1/playlists").json();
    },
  });

  if (isError) {
    return <p>Failed to load playlists</p>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center my-2">
        <CircularProgress />
      </div>
    );
  }

  function handleDelete(id: string) {
    songPlaylistMutation.mutate(id);
  }

  function handleEdit(id: string) {
    navigate(`/playlists/edit/${id}`);
  }

  return (
    <>
      <div className="mb-2">
        <h1 className="float-left text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
          Playlists
        </h1>
        <NavLink
          to="/playlists/create"
          className="float-right p-2 text-white transition rounded-md bg-sky-500 hover:bg-sky-600"
        >
          Create Playlist
        </NavLink>
      </div>
      <div className="clear-both mb-4" />

      <div className="flex flex-wrap my-2">
        <table className="min-w-full">
          <thead className="text-white rounded-lg bg-slate-800">
            <tr>
              <th className="w-1/3 px-4 py-3 text-sm font-semibold text-left uppercase rounded-l-lg">
                Name
              </th>
              <th className="w-1/3 px-4 py-3 text-sm font-semibold text-left uppercase">
                Created By
              </th>
              <th className="w-1/3 px-4 py-3 text-sm font-semibold text-left uppercase">
                Updated By
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-left uppercase">
                Last Updated
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-left uppercase rounded-r-lg"></th>
            </tr>
          </thead>
          <tbody className="text-slate-300" key={data?.data.length}>
            {data?.data.map((playlist, idx) => {
              return idx % 2 === 0 ? (
                <tr key={playlist.id}>
                  <td className="w-1/3 px-4 py-3 text-left capitalize">
                    {playlist.attributes.name}
                  </td>
                  <td className="w-1/3 px-4 py-3 text-left lowercase">
                    {playlist.attributes.createdBy}
                  </td>
                  <td className="w-1/3 px-4 py-3 text-left lowercase">
                    {playlist.attributes.updatedBy}
                  </td>
                  <td className="px-4 py-3 text-left">
                    {new Date(playlist.attributes.updatedAt).toLocaleDateString(
                      "en-US"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      className="cursor-pointer text-sky-500"
                      onClick={() => handleEdit(playlist.id)}
                    >
                      Edit
                    </a>
                    <a
                      className="pl-4 text-pink-500 cursor-pointer"
                      onClick={() => handleDelete(playlist.id)}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ) : (
                <tr
                  key={playlist.id}
                  className="rounded-lg shadow-lg bg-gradient-to-t from-slate-600/10 to-slate-300/10"
                >
                  <td className="w-1/3 px-4 py-3 text-left capitalize rounded-l-lg">
                    {playlist.attributes.name}
                  </td>
                  <td className="w-1/3 px-4 py-3 text-left lowercase">
                    {playlist.attributes.createdBy}
                  </td>
                  <td className="w-1/3 px-4 py-3 text-left lowercase">
                    {playlist.attributes.updatedBy}
                  </td>
                  <td className="px-4 py-3 text-left">
                    {new Date(playlist.attributes.updatedAt).toLocaleDateString(
                      "en-US"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right rounded-r-lg">
                    <a
                      className="cursor-pointer text-sky-500"
                      onClick={() => handleEdit(playlist.id)}
                    >
                      Edit
                    </a>
                    <a
                      className="pl-4 text-pink-500 cursor-pointer"
                      onClick={() => handleDelete(playlist.id)}
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
