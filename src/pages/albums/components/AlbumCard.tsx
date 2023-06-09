import { useNavigate } from "react-router-dom";

type AlbumCardProps = {
  artworkUrl: string;
  title: string;
  releaseDate: string;
};

export function AlbumCard({
  artworkUrl,
  title,
  releaseDate,
  id,
}: AlbumCardProps) {
  const navigate = useNavigate();
  const handleClick = (id: string) => {
    navigate(`${id}`);
  };

  return (
    <div
      onClick={() => handleClick(id)}
      className="relative h-40 m-4 rounded-lg shadow-lg cursor-pointer w-96 bg-gradient-to-t from-slate-600/10 to-slate-300/10"
    >
      <div className="absolute w-40 h-40 border-r rounded-l-lg bg-gradient-to-r from-sky-700/60 to-purple-300/60 border-slate-900" />
      <img
        src={`${artworkUrl}?random=${Math.round(Math.random() * 1000)}`}
        alt={title}
        className="object-cover w-40 h-40 rounded-l-lg "
      />
      <div className="absolute top-0 p-2 left-40">
        <h2 className="mb-2 text-xl font-bold text-transparent uppercase bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
          {title}
        </h2>
        <h6 className="text-white">
          Released: {new Date(releaseDate).toLocaleDateString("en-US")}
        </h6>
      </div>
    </div>
  );
}
