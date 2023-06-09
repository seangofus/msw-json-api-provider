import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import "./App.css";

type Yikes = {
  test: string;
};

function App() {
  const getData: Promise<Yikes> = ky
    .get("http://127.0.0.1:4000/v1/songs")
    .json();
  const { data } = useQuery("todos", () => getData);

  return (
    <>
      <p>hello</p>
      {console.log(data)}
    </>
  );
}

export default App;
