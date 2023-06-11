import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { FormField } from "../../components/FormField";
import ky from "ky";

type NewPlaylist = {
  name: string;
};

const newPlaylist: NewPlaylist = {
  name: "",
};

export type Errors = {
  name?: string;
};

export type Status = "idle" | "submitted";

export default function PlaylistCreate() {
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(newPlaylist);
  const [status, setStatus] = useState<Status>("idle");
  const [formKey, setFormKey] = useState(0);
  const queryClient = useQueryClient();
  const playlistCreateMutation = useMutation({
    mutationFn: (playlist: NewPlaylist) => {
      const json = {
        data: {
          type: "playlists",
          attributes: playlist,
        },
      };
      return ky
        .post(`http://127.0.0.1:4000/v1/playlists`, {
          json,
        })
        .json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      setFormKey(formKey + 1);
      setPlaylist(newPlaylist);
      setStatus("idle");
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      navigate("/playlists");
    },
  });

  const errors = validate();

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setPlaylist({ ...playlist, [e.target.id]: e.target.value });
  }

  function validate() {
    const errors: Errors = {};
    if (!playlist.name) {
      errors.name = "Name is required";
    }

    return errors;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitted");
    if (Object.keys(errors).length > 0) {
      return;
    }

    playlistCreateMutation.mutate({ ...playlist });
  }

  return (
    <>
      <div className="mb-2">
        <h1 className="float-left text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
          Playlist Create
        </h1>
      </div>
      <div className="clear-both mb-4" />
      <form key={formKey} onSubmit={onSubmit}>
        <FormField
          label="Playlist Name"
          id="name"
          onChange={onChange}
          value={playlist.name}
          error={errors.name}
          formSubmitted={status === "submitted"}
        />
        <NavLink
          to="/playlists"
          className="float-left p-2 text-white transition rounded-md bg-slate-500 hover:bg-slate-600"
        >
          Cancel
        </NavLink>
        <button
          type="submit"
          className="float-right p-2 text-white transition rounded-md bg-sky-500 hover:bg-sky-600"
        >
          Create Playlist
        </button>
      </form>
    </>
  );
}
