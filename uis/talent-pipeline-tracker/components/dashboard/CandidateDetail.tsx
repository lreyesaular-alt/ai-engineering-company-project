"use client";

import { CandidateNote, CandidateStatus, CandidateRecord } from "@/types/candidates";
import { FormEvent, useMemo, useState } from "react";
import { NotesSection } from "./NotesSection";

interface EditCandidateValues {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  cv_url: string;
  experience_years: string;
}

const STATUS_OPTIONS: CandidateStatus[] = ["pending", "received", "in_progress", "selected", "discarded"];

interface CandidateDetailProps {
  candidate: CandidateRecord | null;
  isLoadingDetail: boolean;
  detailError: string | null;
  notes: CandidateNote[];
  isLoadingNotes: boolean;
  isSubmittingNote: boolean;
  deletingNoteId: string | null;
  notesError: string | null;
  isSavingEdit: boolean;
  editSuccessMessage: string | null;
  editErrorMessage: string | null;
  isUpdatingStatus: boolean;
  statusUpdateError: string | null;
  statusUpdateSuccess: string | null;
  draftNote: string;
  onDraftChange: (value: string) => void;
  onSubmitNote: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteNote: (noteId: string) => void;
  onSaveEdit: (values: EditCandidateValues) => void;
  onUpdateStatus: (status: CandidateStatus) => Promise<boolean>;
  onClose: () => void;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-900">{value}</p>
    </div>
  );
}

function getPipelineStatus(candidate: CandidateRecord): CandidateStatus {
  if (candidate.stage === "pending") {
    return "pending";
  }

  return candidate.status;
}

function toEditValues(candidate: CandidateRecord): EditCandidateValues {
  return {
    full_name: candidate.full_name,
    email: candidate.email,
    phone: candidate.phone ?? "",
    position: candidate.position ?? "",
    linkedin_url: candidate.linkedin_url ?? "",
    cv_url: candidate.cv_url ?? "",
    experience_years: String(candidate.experience_years ?? 0),
  };
}

const EMPTY_EDIT_VALUES: EditCandidateValues = {
  full_name: "",
  email: "",
  phone: "",
  position: "",
  linkedin_url: "",
  cv_url: "",
  experience_years: "",
};

export function CandidateDetail({
  candidate,
  isLoadingDetail,
  detailError,
  notes,
  isLoadingNotes,
  isSubmittingNote,
  deletingNoteId,
  notesError,
  isSavingEdit,
  editSuccessMessage,
  editErrorMessage,
  isUpdatingStatus,
  statusUpdateError,
  statusUpdateSuccess,
  draftNote,
  onDraftChange,
  onSubmitNote,
  onDeleteNote,
  onSaveEdit,
  onUpdateStatus,
  onClose,
}: CandidateDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<EditCandidateValues>(() =>
    candidate ? toEditValues(candidate) : EMPTY_EDIT_VALUES,
  );
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [statusToSet, setStatusToSet] = useState<CandidateStatus>(() =>
    candidate ? getPipelineStatus(candidate) : "received",
  );

  const pipelineStatus = useMemo(() => {
    if (!candidate) return "received" as CandidateStatus;
    return getPipelineStatus(candidate);
  }, [candidate]);

  function validateEditForm(values: EditCandidateValues): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!values.full_name.trim()) errors.full_name = "El nombre es obligatorio.";
    if (!values.email.trim()) errors.email = "El email es obligatorio.";
    if (!values.phone.trim()) errors.phone = "El teléfono es obligatorio.";
    if (!values.position.trim()) errors.position = "La posición es obligatoria.";

    const parsedExperience = Number(values.experience_years);
    if (!values.experience_years.trim()) {
      errors.experience_years = "La experiencia es obligatoria.";
    } else if (!Number.isInteger(parsedExperience) || parsedExperience < 0) {
      errors.experience_years = "Ingresa un entero mayor o igual a 0.";
    }

    return errors;
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateEditForm(editValues);
    setEditErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSaveEdit(editValues);
  }

  if (isLoadingDetail) {
    return (
      <p role="status" aria-live="polite" className="text-sm text-slate-600">
        Cargando detalle del candidato...
      </p>
    );
  }

  if (detailError) {
    return (
      <p role="alert" className="rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700">
        {detailError}
      </p>
    );
  }

  if (!candidate) {
    return <p className="text-sm text-slate-600">Selecciona un candidato para ver el detalle.</p>;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">{candidate.full_name}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          aria-label="Cerrar detalle"
        >
          Cerrar
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <InfoRow label="Email" value={candidate.email} />
        <InfoRow label="Teléfono" value={candidate.phone ?? "Sin dato"} />
        <InfoRow label="Posición" value={candidate.position ?? "Sin dato"} />
        <InfoRow label="Experiencia" value={`${candidate.experience_years ?? "-"} años`} />
        <InfoRow label="Estado" value={candidate.status} />
        <InfoRow label="Aplicó" value={formatDate(candidate.applied_at)} />
        <InfoRow label="Actualizado" value={formatDate(candidate.updated_at)} />
      </div>

      <section className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900">Editar candidatura</h3>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setEditValues(toEditValues(candidate));
                setEditErrors({});
                setIsEditing(true);
              }}
              className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:border-slate-500"
            >
              Editar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditErrors({});
                setEditValues(toEditValues(candidate));
              }}
              className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:border-slate-500"
            >
              Cancelar
            </button>
          )}
        </div>

        {isEditing && (
          <form onSubmit={handleEditSubmit} className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="edit_full_name">
                Nombre completo
              </label>
              <input
                id="edit_full_name"
                type="text"
                value={editValues.full_name}
                onChange={(event) => setEditValues((prev) => ({ ...prev, full_name: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                disabled={isSavingEdit}
              />
              {editErrors.full_name && (
                <p role="alert" className="mt-1 text-xs text-rose-700">
                  {editErrors.full_name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="edit_email">
                Email
              </label>
              <input
                id="edit_email"
                type="email"
                value={editValues.email}
                onChange={(event) => setEditValues((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                disabled={isSavingEdit}
              />
              {editErrors.email && (
                <p role="alert" className="mt-1 text-xs text-rose-700">
                  {editErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="edit_phone">
                Teléfono
              </label>
              <input
                id="edit_phone"
                type="text"
                value={editValues.phone}
                onChange={(event) => setEditValues((prev) => ({ ...prev, phone: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                disabled={isSavingEdit}
              />
              {editErrors.phone && (
                <p role="alert" className="mt-1 text-xs text-rose-700">
                  {editErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="edit_position">
                Posición
              </label>
              <input
                id="edit_position"
                type="text"
                value={editValues.position}
                onChange={(event) => setEditValues((prev) => ({ ...prev, position: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                disabled={isSavingEdit}
              />
              {editErrors.position && (
                <p role="alert" className="mt-1 text-xs text-rose-700">
                  {editErrors.position}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="edit_experience">
                Experiencia (años)
              </label>
              <input
                id="edit_experience"
                type="number"
                min={0}
                step={1}
                value={editValues.experience_years}
                onChange={(event) =>
                  setEditValues((prev) => ({ ...prev, experience_years: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                disabled={isSavingEdit}
              />
              {editErrors.experience_years && (
                <p role="alert" className="mt-1 text-xs text-rose-700">
                  {editErrors.experience_years}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="edit_linkedin">
                LinkedIn URL
              </label>
              <input
                id="edit_linkedin"
                type="url"
                value={editValues.linkedin_url}
                onChange={(event) => setEditValues((prev) => ({ ...prev, linkedin_url: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                disabled={isSavingEdit}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="edit_cv">
                CV URL
              </label>
              <input
                id="edit_cv"
                type="url"
                value={editValues.cv_url}
                onChange={(event) => setEditValues((prev) => ({ ...prev, cv_url: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                disabled={isSavingEdit}
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSavingEdit}
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSavingEdit ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={() => {
                  setIsEditing(false);
                  setEditErrors({});
                  setEditValues(toEditValues(candidate));
                }}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {editSuccessMessage && (
          <p role="status" aria-live="polite" className="text-sm text-emerald-700">
            {editSuccessMessage}
          </p>
        )}
        {editErrorMessage && (
          <p role="alert" className="text-sm text-rose-700">
            {editErrorMessage}
          </p>
        )}
      </section>

      <section className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-base font-semibold text-slate-900">Cambiar estado</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="candidate-status" className="text-sm font-medium text-slate-700">
              Estado del pipeline
            </label>
            <select
              id="candidate-status"
              value={statusToSet}
              onChange={(event) => setStatusToSet(event.target.value as CandidateStatus)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isUpdatingStatus}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={isUpdatingStatus || statusToSet === pipelineStatus}
            onClick={async () => {
              const didUpdate = await onUpdateStatus(statusToSet);
              if (didUpdate) {
                setStatusToSet(statusToSet);
              }
            }}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isUpdatingStatus ? "Actualizando..." : "Actualizar estado"}
          </button>
        </div>
        {statusUpdateSuccess && (
          <p role="status" aria-live="polite" className="text-sm text-emerald-700">
            {statusUpdateSuccess}
          </p>
        )}
        {statusUpdateError && (
          <p role="alert" className="text-sm text-rose-700">
            {statusUpdateError}
          </p>
        )}
      </section>

      <div className="mt-5 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">LinkedIn</p>
          {candidate.linkedin_url ? (
            <a
              href={candidate.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-blue-700 underline underline-offset-2"
            >
              Abrir perfil de LinkedIn
            </a>
          ) : (
            <p className="mt-1 text-sm text-slate-700">No disponible</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">CV</p>
          {candidate.cv_url ? (
            <a
              href={candidate.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-blue-700 underline underline-offset-2"
            >
              Abrir CV
            </a>
          ) : (
            <p className="mt-1 text-sm text-slate-700">No disponible</p>
          )}
        </div>
      </div>

      <NotesSection
        notes={notes}
        draftNote={draftNote}
        isLoadingNotes={isLoadingNotes}
        isSubmittingNote={isSubmittingNote}
        deletingNoteId={deletingNoteId}
        notesError={notesError}
        onDraftChange={onDraftChange}
        onSubmitNote={onSubmitNote}
        onDeleteNote={onDeleteNote}
      />
    </div>
  );
}
