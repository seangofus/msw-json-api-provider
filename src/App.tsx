import { useQuery } from "react-query";
import ky from "ky";
import "./App.css";

type Yikes = {
  test: string;
};

function App() {
  const getData: Promise<Yikes> = ky
    .get("http://127.0.0.1:4000/v1/songs")
    .json();
  const query = useQuery("todos", () => getData);

  return (
    <>
      <p>asdf</p>
    </>
  );
}

export default App;
