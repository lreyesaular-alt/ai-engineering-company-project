import { CandidateRecord } from "@/types/candidates";
import { CandidateCard } from "./CandidateCard";

interface CandidateListProps {
  candidates: CandidateRecord[];
  selectedCandidateId: string | null;
  onSelect: (id: string) => void;
}

export function CandidateList({ candidates, selectedCandidateId, onSelect }: CandidateListProps) {
  return (
    <div className="space-y-3">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          isSelected={selectedCandidateId === candidate.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
