import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { FormField } from "../../components/FormField";
import ky from "ky";

type NewAlbum = {
  title: string;
  artworkUrl: string;
  releaseDate: string;
};

const newAlbum: NewAlbum = {
  title: "",
  artworkUrl: "",
  releaseDate: "",
};

export type Errors = {
  title?: string;
  artworkUrl?: string;
  releaseDate?: string;
};

export type Status = "idle" | "submitted";

export default function AlbumCreate() {
  const navigate = useNavigate();
  const [album, setAlbum] = useState(newAlbum);
  const [status, setStatus] = useState<Status>("idle");
  const [formKey, setFormKey] = useState(0);
  const queryClient = useQueryClient();
  const albumMutation = useMutation({
    mutationFn: (album: NewAlbum) => {
      const json = {
        data: {
          type: "albums",
          attributes: album,
        },
      };
      return ky
        .post(`http://127.0.0.1:4000/v1/albums`, {
          json,
        })
        .json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      setFormKey(formKey + 1);
      setAlbum(newAlbum);
      setStatus("idle");
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      navigate("/albums");
    },
  });

  const errors = validate();

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setAlbum({ ...album, [e.target.id]: e.target.value });
  }

  function validate() {
    const errors: Errors = {};
    if (!album.title) {
      errors.title = "Title is required";
    }
    if (!album.artworkUrl) {
      errors.artworkUrl = "Artwork Url is required";
    }
    if (!album.releaseDate) {
      errors.releaseDate = "Release Date is required";
    }

    return errors;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitted");
    if (Object.keys(errors).length > 0) {
      return;
    }
    const updatedAlbum = {
      ...album,
    };
    albumMutation.mutate(updatedAlbum);
  }

  return (
    <>
      <div className="mb-2">
        <h1 className="float-left text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
          Album Create
        </h1>
      </div>
      <div className="clear-both mb-4" />
      <form key={formKey} onSubmit={onSubmit}>
        <FormField
          label="Title"
          id="title"
          onChange={onChange}
          value={album.title}
          error={errors.title}
          formSubmitted={status === "submitted"}
        />
        <FormField
          label="Artwork Url"
          id="artworkUrl"
          onChange={onChange}
          value={album.artworkUrl}
          error={errors.artworkUrl}
          formSubmitted={status === "submitted"}
        />
        <FormField
          label="Release Date"
          id="releaseDate"
          onChange={onChange}
          value={album.releaseDate}
          error={errors.releaseDate}
          formSubmitted={status === "submitted"}
        />
        <NavLink
          to="/albums"
          className="float-left p-2 text-white transition rounded-md bg-slate-500 hover:bg-slate-600"
        >
          Cancel
        </NavLink>
        <button
          type="submit"
          className="float-right p-2 text-white transition rounded-md bg-sky-500 hover:bg-sky-600"
        >
          Create Album
        </button>
      </form>
    </>
  );
}
