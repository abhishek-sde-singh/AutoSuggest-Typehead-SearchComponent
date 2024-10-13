import "./App.css";
import { useCallback, useEffect, useState } from "react";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

function App() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSetQuery = useCallback(
    debounce((value) => setDebouncedQuery(value), 500),
    []
  );

  const fetchData = async () => {
    console.log("i am called");
    try {
      setLoading(true);
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${debouncedQuery}`
      );
      const result = await response.json();
      setData(result.products);
      setLoading(false);
    } catch (e) {
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    debouncedSetQuery(e.target.value);
  };

  useEffect(() => {
    fetchData();
  }, [debouncedQuery]);

  return (
    <div>
      <h1>Auto Complete / Auto Suggest / TypeHead</h1>
      <input
        type="text"
        value={query}
        placeholder="Searc.."
        onChange={(e) => handleInputChange(e)}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {data.map((item) => {
          return (
            <li
              key={item.id}
              onClick={() => {
                setQuery(item.title);
                debouncedSetQuery(item.title);
              }}
            >
              {item.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
