import { useState, useEffect } from "react";
const KEY = "4e475c66";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&S=${query}`,
            { signal: controller.signal }
          );
          //error case
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          //no data case
          if (data.Response === "False") throw new Error("No Movie found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          //excluding error given by abort
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      //clean up function
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
