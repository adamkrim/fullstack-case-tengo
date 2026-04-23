import { TenderList } from "./components/TenderList";
import { useTenders } from "./hooks/useTenders";

function App() {
  const {
    tenders,
    total,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    acceptTender,
    rejectTender,
  } = useTenders();

  if (isLoading) return <p className="p-8 text-gray-500">Chargement...</p>;
  if (isError)
    return <p className="p-8 text-red-500">Une erreur est survenue.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Appels d'offres
          {total !== null && (
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              ({total})
            </span>
          )}
        </h1>
        <TenderList
          tenders={tenders}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          onAccept={acceptTender}
          onReject={rejectTender}
        />
      </div>
    </div>
  );
}

export default App;
