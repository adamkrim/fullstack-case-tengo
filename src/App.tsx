import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { fetchTenders } from "./api";
import { TenderCard } from "./components/TenderCard";

const PAGE_SIZE = 20;

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

  if (isLoading) return <p className="p-8 text-gray-500">Chargement...</p>;
  if (isError)
    return <p className="p-8 text-red-500">Une erreur est survenue.</p>;
  if (!data) return null;

  const tenders = data.pages.flatMap((page) => page.results);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-900">Appels d'offres</h1>

        {tenders.map((tender) => (
          <TenderCard
            key={tender.id}
            tender={tender}
            onAccept={(id) => console.log("accept", id)}
            onReject={(id) => console.log("reject", id)}
          />
        ))}

        <div ref={ref} className="py-4 text-center text-sm text-gray-400">
          {isFetchingNextPage
            ? "Chargement..."
            : !hasNextPage
              ? "Tous les résultats sont affichés"
              : null}
        </div>
      </div>
    </div>
  );
}

export default App;
