import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { fetchTenders } from "./api";
import type { Tender } from "./types";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 3;

function App() {
  const { ref, inView } = useInView();

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
      if (lastPage.results.length < PAGE_SIZE) return undefined;
      return lastPageParam + PAGE_SIZE;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;
  if (!data) return <p>No data found!</p>;

  const tenders = data.pages.flatMap((page) => page.results);

  return (
    <div>
      <Button>Click me</Button>
      <h1>Tenders</h1>
      <ul>
        {tenders.map((tender: Tender) => (
          <li key={tender.id}>{tender.title}</li>
        ))}
      </ul>
      <div ref={ref}>
        {isFetchingNextPage
          ? "Loading more..."
          : !hasNextPage
            ? "Nothing more to load"
            : null}
      </div>
    </div>
  );
}

export default App;
