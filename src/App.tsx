import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTenders } from "./api";
import type { Tender } from "./types";

const PAGE_SIZE = 3;

function App() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["tenders"],
    queryFn: ({ pageParam }) =>
      fetchTenders({ skip: pageParam, take: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.results.length < PAGE_SIZE) return null;
      return lastPageParam + PAGE_SIZE;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;
  if (!data) return <p>No data found!</p>;

  const tenders = data.pages.flatMap((page) => page.results);

  return (
    <div>
      <h1>Tenders</h1>
      <ul>
        {tenders.map((tender: Tender) => (
          <li key={tender.id}>{tender.title}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
      </button>
    </div>
  );
}

export default App;
