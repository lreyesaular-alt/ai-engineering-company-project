import { CandidateNote } from "@/types/candidates";
import { FormEvent } from "react";

interface NotesSectionProps {
  notes: CandidateNote[];
  draftNote: string;
  isLoadingNotes: boolean;
  isSubmittingNote: boolean;
  deletingNoteId: string | null;
  notesError: string | null;
  onDraftChange: (value: string) => void;
  onSubmitNote: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteNote: (noteId: string) => void;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function NotesSection({
  notes,
  draftNote,
  isLoadingNotes,
  isSubmittingNote,
  deletingNoteId,
  notesError,
  onDraftChange,
  onSubmitNote,
  onDeleteNote,
}: NotesSectionProps) {
  return (
    <section className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Notas</h3>

      <form onSubmit={onSubmitNote} className="space-y-3">
        <textarea
          value={draftNote}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Escribe una nota sobre este candidato"
          rows={4}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
          disabled={isSubmittingNote}
        />
        <button
          type="submit"
          disabled={isSubmittingNote || !draftNote.trim()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmittingNote ? "Agregando..." : "Agregar nota"}
        </button>
      </form>

      {notesError && <p className="rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700">{notesError}</p>}

      {isLoadingNotes ? (
        <p className="text-sm text-slate-600">Cargando notas...</p>
      ) : notes.length === 0 ? (
        <p className="text-sm text-slate-600">Aún no hay notas para este candidato.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm text-slate-800">{note.content}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500">{formatDate(note.created_at)}</p>
                <button
                  type="button"
                  disabled={deletingNoteId === note.id}
                  onClick={() => {
                    const confirmed = window.confirm("¿Seguro que deseas eliminar esta nota?");
                    if (!confirmed) return;
                    onDeleteNote(note.id);
                  }}
                  className="rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-700 transition hover:border-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingNoteId === note.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
