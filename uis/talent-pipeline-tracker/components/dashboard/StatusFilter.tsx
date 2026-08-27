export type PipelineFilter = "all" | "pending" | "received" | "in_progress" | "selected" | "discarded";

interface StatusOption {
  label: string;
  value: Exclude<PipelineFilter, "all">;
}

const STATUS_OPTIONS: StatusOption[] = [
  { label: "Pendiente", value: "pending" },
  { label: "Recibido", value: "received" },
  { label: "En proceso", value: "in_progress" },
  { label: "Seleccionado", value: "selected" },
  { label: "Descartado", value: "discarded" },
];

interface StatusFilterProps {
  selectedStatus: PipelineFilter;
  onStatusChange: (status: PipelineFilter) => void;
}

export function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">Filtrar por estado</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onStatusChange("all")}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            selectedStatus === "all"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
          }`}
        >
          Todos
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status.value}
            type="button"
            onClick={() => onStatusChange(status.value)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              selectedStatus === status.value
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
