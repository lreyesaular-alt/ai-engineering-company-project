interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="candidate-search" className="text-sm font-medium text-slate-700">
        Buscar por nombre o email
      </label>
      <input
        id="candidate-search"
        type="text"
        placeholder="Buscar por nombre o email"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
      />
    </div>
  );
}
