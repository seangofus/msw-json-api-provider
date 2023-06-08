import ky from "ky";
import { useQuery } from "react-query";

type Album = {};

export default function Albums() {
  const getData: Promise<Album> = ky
    .get("http://127.0.0.1:4000/v1/albums")
    .json();

  const { data } = useQuery("albums", () => getData);

  return (
    <>
      {console.log(data)}
      <div>asdkljfaf</div>
    </>
  );
}
