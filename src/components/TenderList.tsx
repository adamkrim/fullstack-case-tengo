import * as React from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Tender } from "@/types";
import { TenderCard } from "./TenderCard";

interface TenderListProps {
  tenders: Tender[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export function TenderList({
  tenders,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onAccept,
  onReject,
}: TenderListProps) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const listOffsetRef = React.useRef(0);

  React.useLayoutEffect(() => {
    listOffsetRef.current = listRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: tenders.length,
    estimateSize: () => 160,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  const virtualItems = virtualizer.getVirtualItems();

  React.useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= tenders.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    tenders.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  return (
    <>
      <div
        ref={listRef}
        style={{ height: virtualizer.getTotalSize(), position: "relative" }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
            }}
          >
            <div className="pb-4">
              <TenderCard
                tender={tenders[virtualItem.index]}
                onAccept={onAccept}
                onReject={onReject}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="py-4 text-center text-sm text-gray-400">
        {isFetchingNextPage
          ? "Chargement..."
          : !hasNextPage
            ? "Tous les résultats sont affichés"
            : null}
      </div>
    </>
  );
}
