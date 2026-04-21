import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortControlProps {
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

export function SortControl({ sortOrder, setSortOrder }: SortControlProps) {
  const next = sortOrder === "asc" ? "desc" : "asc";
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setSortOrder(next)}
      className="gap-2"
      aria-label={`Sort stations ${sortOrder === "asc" ? "A to Z" : "Z to A"}`}
    >
      {sortOrder === "asc" ? (
        <>
          <ArrowDownAZ className="h-4 w-4" />
          A to Z
        </>
      ) : (
        <>
          <ArrowUpAZ className="h-4 w-4" />
          Z to A
        </>
      )}
    </Button>
  );
}
