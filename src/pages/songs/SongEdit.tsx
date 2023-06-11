import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { FormField } from "../../components/FormField";
import ky from "ky";
import { CircularProgress } from "@mui/material";

type NewSong = {
  title: string;
  artist: string;
  length: string;
};

const newSong: NewSong = {
  title: "",
  artist: "",
  length: "",
};

export type Errors = {
  title?: string;
  artist?: string;
  length?: string;
};

export type Status = "idle" | "submitted";

export default function SongEdit() {
  const { id } = useParams();

  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: ["songs", id],
    queryFn: async () => {
      const data = await ky.get(`http://127.0.0.1:4000/v1/songs/${id}`).json();
      setSong({ ...newSong, ...data.data.attributes });
      return data;
    },
  });

  const navigate = useNavigate();
  const [song, setSong] = useState(newSong);
  const [status, setStatus] = useState<Status>("idle");
  const [formKey, setFormKey] = useState(0);
  const queryClient = useQueryClient();
  const albumMutation = useMutation({
    mutationFn: (song: NewSong) => {
      const json = {
        data: {
          type: "songs",
          id,
          attributes: song,
        },
      };
      return ky
        .patch(`http://127.0.0.1:4000/v1/songs/${id}`, {
          json,
        })
        .json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      setFormKey(formKey + 1);
      setSong(newSong);
      setStatus("idle");
      queryClient.invalidateQueries({ queryKey: ["songs", id] });
      navigate(`/songs`);
    },
  });

  const errors = validate();

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setSong({ ...song, [e.target.id]: e.target.value });
  }

  function validate() {
    const errors: Errors = {};
    if (!song.title) {
      errors.title = "Title is required";
    }
    if (!song.artist) {
      errors.artist = "Artist is required";
    }
    if (!song.length) {
      errors.length = "Length is required";
    }

    return errors;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitted");
    if (Object.keys(errors).length > 0) {
      return;
    }

    albumMutation.mutate({ ...song });
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center my-2">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className="mb-2">
        <h1 className="float-left text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
          Song Edit
        </h1>
      </div>
      <div className="clear-both mb-4" />
      <form key={formKey} onSubmit={onSubmit}>
        <FormField
          label="Title"
          id="title"
          onChange={onChange}
          value={song.title}
          error={errors.title}
          formSubmitted={status === "submitted"}
        />
        <FormField
          label="Artist"
          id="artist"
          onChange={onChange}
          value={song.artist}
          error={errors.artist}
          formSubmitted={status === "submitted"}
        />
        <FormField
          label="Song Length"
          id="length"
          onChange={onChange}
          value={song.length}
          error={errors.length}
          formSubmitted={status === "submitted"}
        />
        <NavLink
          to="/songs"
          className="float-left p-2 text-white transition rounded-md bg-slate-500 hover:bg-slate-600"
        >
          Cancel
        </NavLink>
        <button
          type="submit"
          className="float-right p-2 text-white transition rounded-md bg-sky-500 hover:bg-sky-600"
        >
          Save Song
        </button>
      </form>
    </>
  );
}
