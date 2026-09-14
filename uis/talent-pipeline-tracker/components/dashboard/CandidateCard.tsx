import { CandidateRecord } from "@/types/candidates";

interface CandidateCardProps {
  candidate: CandidateRecord;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

function getPipelineStatus(candidate: CandidateRecord): string {
  return candidate.stage === "pending" ? "pending" : candidate.status;
}

export function CandidateCard({ candidate, isSelected, onSelect }: CandidateCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(candidate.id)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        isSelected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
      }`}
    >
      <p className="text-base font-semibold">{candidate.full_name}</p>
      <p className={`mt-1 text-sm ${isSelected ? "text-slate-200" : "text-slate-600"}`}>
        {candidate.email}
      </p>
      <div className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
        <p>
          <span className={isSelected ? "text-slate-300" : "text-slate-500"}>Posición:</span>{" "}
          {candidate.position ?? "Sin dato"}
        </p>
        <p>
          <span className={isSelected ? "text-slate-300" : "text-slate-500"}>Estado:</span>{" "}
          {formatStatus(getPipelineStatus(candidate))}
        </p>
        <p>
          <span className={isSelected ? "text-slate-300" : "text-slate-500"}>Experiencia:</span>{" "}
          {candidate.experience_years ?? "-"} años
        </p>
      </div>
    </button>
  );
}
