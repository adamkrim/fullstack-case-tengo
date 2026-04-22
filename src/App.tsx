import { useQuery } from "@tanstack/react-query";
import { fetchTenders } from "./api";
import type { Tender } from "./types";

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tenders"],
    queryFn: () => fetchTenders({ skip: 0, take: 20 }),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;
  if (!data) return <p>No data found!</p>;

  return (
    <div>
      <h1>Tenders</h1>
      <ul>
        {data.results.map((tender: Tender) => (
          <li key={tender.id}>{tender.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
