import type { Tender } from "@/types";
import { Card, CardContent } from "./ui/card";
import viteLogo from "@/assets/vite.svg";
import { Button } from "./ui/button";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface TenderCardProps {
  tender: Tender;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export function TenderCard({ tender, onAccept, onReject }: TenderCardProps) {
  return (
    <Card>
      <CardContent>
        <p>{tender.id}</p>

        <img
          // Mocked logo seems not accessible
          src={viteLogo}
          alt={`Logo ${tender.buyerName}`}
          className="w-6 h-6"
        />
        <p>{tender.buyerName}</p>
        <p>{tender.title}</p>
        <p>
          {formatDate(tender.publicationDate)} →{" "}
          {formatDate(tender.responseDeadline)}
        </p>

        <Button variant="destructive" onClick={() => onReject(tender.id)}>
          Reject
        </Button>
        <Button variant="secondary" onClick={() => onAccept(tender.id)}>
          To Analyze
        </Button>
      </CardContent>
    </Card>
  );
}
