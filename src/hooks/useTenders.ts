import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTenders, saveInteraction } from "@/api";

const PAGE_SIZE = 20;
const CHANNEL_NAME = "tenders";

type DecisionStatus = "TO_ANALYZE" | "REJECTED";

export function useTenders() {
  const [decidedIds, setDecidedIds] = React.useState<Set<number>>(new Set());
  const channelRef = React.useRef<BroadcastChannel | null>(null);

  const markDecided = React.useCallback((id: number) => {
    setDecidedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const unmarkDecided = React.useCallback((id: number) => {
    setDecidedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  React.useEffect(
    () => {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (e) => {
        if (e.data.type === "decided") markDecided(e.data.id);
        if (e.data.type === "undecided") unmarkDecided(e.data.id);
      };

      return () => {
        channel.close();
        channelRef.current = null;
      };
    },
    // These dependecies are stable with useCallback
    // channel is created once
    [markDecided, unmarkDecided]
  );

  const decide = React.useCallback(
    async (id: number, decisionStatus: DecisionStatus) => {
      markDecided(id);
      channelRef.current?.postMessage({ type: "decided", id });

      try {
        await saveInteraction(id, decisionStatus);
      } catch (error) {
        unmarkDecided(id);
        channelRef.current?.postMessage({ type: "undecided", id });
        throw error; // TODO: maybe add a toaster for UI feedback
      }
    },
    [markDecided, unmarkDecided]
  );

  const acceptTender = React.useCallback(
    (id: number) => decide(id, "TO_ANALYZE"),
    [decide]
  );

  const rejectTender = React.useCallback(
    (id: number) => decide(id, "REJECTED"),
    [decide]
  );

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

  const tenders = React.useMemo(
    () =>
      (data?.pages.flatMap((page) => page.results) ?? []).filter(
        (t) => !decidedIds.has(t.id)
      ),
    [data, decidedIds]
  );

  const total = React.useMemo(() => {
    const backendTotal = data?.pages[0]?.total ?? null;
    if (backendTotal === null) return null;
    return Math.max(0, backendTotal - decidedIds.size);
  }, [data, decidedIds]);

  return {
    tenders,
    total,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    acceptTender,
    rejectTender,
  };
}
