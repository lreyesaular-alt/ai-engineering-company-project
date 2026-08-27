"use client";

import { CandidateDetail } from "@/components/dashboard/CandidateDetail";
import { CandidateList } from "@/components/dashboard/CandidateList";
import { NewCandidateForm } from "@/components/dashboard/NewCandidateForm";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { PipelineFilter, StatusFilter } from "@/components/dashboard/StatusFilter";
import {
  addRecordNote,
  deleteRecordNote,
  getRecordById,
  getRecordNotes,
  getRecords,
  getRecordsPage,
  patchRecordStatus,
  updateRecord,
} from "@/lib/api";
import { CandidateNote, CandidateRecord, CandidateStatus } from "@/types/candidates";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

const PAGE_LIMIT = 20;

interface EditCandidateValues {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  cv_url: string;
  experience_years: string;
}

export default function Home() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);
  const [allCandidatesCache, setAllCandidatesCache] = useState<CandidateRecord[] | null>(null);
  const [isLoadingAllCandidates, setIsLoadingAllCandidates] = useState(false);
  const [allCandidatesError, setAllCandidatesError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<PipelineFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [draftNote, setDraftNote] = useState("");
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);

  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState<string | null>(null);
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(null);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);

  const listRequestRef = useRef(0);
  const detailRequestRef = useRef(0);
  const allCandidatesRequestRef = useRef(0);
  const selectedCandidateIdRef = useRef<string | null>(null);

  const isSearchActive = searchTerm.trim().length > 0;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCandidates / PAGE_LIMIT));
  }, [totalCandidates]);

  useEffect(() => {
    selectedCandidateIdRef.current = selectedCandidateId;
  }, [selectedCandidateId]);

  const loadCandidatesPage = useCallback(async (page: number) => {
    const requestId = ++listRequestRef.current;
    setIsLoadingCandidates(true);
    setCandidatesError(null);

    try {
      const data = await getRecordsPage(page, PAGE_LIMIT);
      if (requestId !== listRequestRef.current) return;

      setCandidates(data.data ?? []);
      setTotalCandidates(data.total ?? 0);
      setCurrentPage(data.page > 0 ? data.page : page);
    } catch (error) {
      if (requestId !== listRequestRef.current) return;
      const message = error instanceof Error ? error.message : "Error al cargar candidatos.";
      setCandidatesError(message);
    } finally {
      if (requestId !== listRequestRef.current) return;
      setIsLoadingCandidates(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadCandidatesPage(currentPage);
    });
  }, [currentPage, loadCandidatesPage]);

  const loadAllCandidates = useCallback(async () => {
    if (allCandidatesCache) return;

    const requestId = ++allCandidatesRequestRef.current;
    setIsLoadingAllCandidates(true);
    setAllCandidatesError(null);

    try {
      const records = await getRecords();
      if (requestId !== allCandidatesRequestRef.current) return;
      setAllCandidatesCache(records);
    } catch (error) {
      if (requestId !== allCandidatesRequestRef.current) return;
      const message = error instanceof Error ? error.message : "Error al cargar candidatos para búsqueda.";
      setAllCandidatesError(message);
    } finally {
      if (requestId !== allCandidatesRequestRef.current) return;
      setIsLoadingAllCandidates(false);
    }
  }, [allCandidatesCache]);

  useEffect(() => {
    if (!isSearchActive || allCandidatesCache) return;

    queueMicrotask(() => {
      void loadAllCandidates();
    });
  }, [isSearchActive, allCandidatesCache, loadAllCandidates]);

  async function refreshCandidatesAfterCreate() {
    setAllCandidatesCache(null);
    setAllCandidatesError(null);
    await loadCandidatesPage(currentPage);
  }

  useEffect(() => {
    if (!selectedCandidateId) return;

    const candidateId = selectedCandidateId;
    const requestId = ++detailRequestRef.current;

    async function loadCandidateDetailAndNotes() {
      setIsLoadingDetail(true);
      setIsLoadingNotes(true);
      setDetailError(null);
      setNotesError(null);

      try {
        const [detailData, notesData] = await Promise.all([
          getRecordById(candidateId),
          getRecordNotes(candidateId),
        ]);

        if (requestId !== detailRequestRef.current || selectedCandidateIdRef.current !== candidateId) return;

        setSelectedCandidate(detailData);
        setNotes(notesData);
      } catch (error) {
        if (requestId !== detailRequestRef.current || selectedCandidateIdRef.current !== candidateId) return;
        const message = error instanceof Error ? error.message : "Error al cargar detalle del candidato.";
        setDetailError(message);
      } finally {
        if (requestId !== detailRequestRef.current || selectedCandidateIdRef.current !== candidateId) return;
        setIsLoadingDetail(false);
        setIsLoadingNotes(false);
      }
    }

    loadCandidateDetailAndNotes();
  }, [selectedCandidateId]);

  function updateCandidateInListAndDetail(updatedCandidate: CandidateRecord) {
    setCandidates((prev) =>
      prev.map((candidate) => (candidate.id === updatedCandidate.id ? updatedCandidate : candidate)),
    );

    setAllCandidatesCache((prev) => {
      if (!prev) return prev;
      return prev.map((candidate) =>
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate,
      );
    });

    if (selectedCandidateIdRef.current === updatedCandidate.id) {
      setSelectedCandidate(updatedCandidate);
    }
  }

  function clearDetailFeedback() {
    setDetailError(null);
    setNotesError(null);
    setEditErrorMessage(null);
    setEditSuccessMessage(null);
    setStatusUpdateError(null);
    setStatusUpdateSuccess(null);
  }

  function handleSelectCandidate(id: string) {
    setSelectedCandidateId(id);
    setSelectedCandidate(null);
    setNotes([]);
    clearDetailFeedback();
    setDraftNote("");
    setDeletingNoteId(null);
  }

  function handleCloseDetail() {
    setSelectedCandidateId(null);
    setSelectedCandidate(null);
    setNotes([]);
    clearDetailFeedback();
    setDraftNote("");
    setIsLoadingDetail(false);
    setIsLoadingNotes(false);
    setIsSubmittingNote(false);
    setDeletingNoteId(null);
    setIsSavingEdit(false);
    setIsUpdatingStatus(false);
  }

  const filteredCandidates = useMemo(() => {
    const sourceCandidates = isSearchActive ? (allCandidatesCache ?? []) : candidates;

    return sourceCandidates.filter((candidate) => {
      const matchesStatus = (() => {
        if (selectedStatus === "all") return true;
        if (selectedStatus === "pending") return candidate.stage === "pending";
        if (selectedStatus === "received") return candidate.status === "received";
        if (selectedStatus === "in_progress") return candidate.status === "in_progress";
        if (selectedStatus === "selected") return candidate.status === "selected";
        if (selectedStatus === "discarded") return candidate.status === "discarded";
        return true;
      })();

      const term = searchTerm.trim().toLowerCase();

      if (!term) {
        return matchesStatus;
      }

      const matchesSearch =
        candidate.full_name.toLowerCase().includes(term) ||
        candidate.email.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [allCandidatesCache, candidates, isSearchActive, searchTerm, selectedStatus]);

  const isLoadingList =
    isLoadingCandidates || (isSearchActive && isLoadingAllCandidates && !allCandidatesCache);
  const listError = candidatesError ?? (isSearchActive ? allCandidatesError : null);

  async function handleSubmitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCandidateId || !draftNote.trim()) {
      return;
    }

    const candidateId = selectedCandidateId;

    setIsSubmittingNote(true);
    setNotesError(null);

    try {
      await addRecordNote(candidateId, draftNote.trim());
      setDraftNote("");
      const latestNotes = await getRecordNotes(candidateId);
      if (selectedCandidateIdRef.current !== candidateId) return;
      setNotes(latestNotes);
    } catch (error) {
      if (selectedCandidateIdRef.current !== candidateId) return;
      const message = error instanceof Error ? error.message : "No se pudo agregar la nota.";
      setNotesError(message);
    } finally {
      if (selectedCandidateIdRef.current !== candidateId) return;
      setIsSubmittingNote(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!selectedCandidateId) return;
    const candidateId = selectedCandidateId;

    setDeletingNoteId(noteId);
    setNotesError(null);

    try {
      await deleteRecordNote(candidateId, noteId);
      const latestNotes = await getRecordNotes(candidateId);
      if (selectedCandidateIdRef.current !== candidateId) return;
      setNotes(latestNotes);
    } catch (error) {
      if (selectedCandidateIdRef.current !== candidateId) return;
      const message = error instanceof Error ? error.message : "No se pudo eliminar la nota.";
      setNotesError(message);
    } finally {
      if (selectedCandidateIdRef.current !== candidateId) return;
      setDeletingNoteId(null);
    }
  }

  async function handleSaveEdit(values: EditCandidateValues) {
    if (!selectedCandidateId || !selectedCandidate) return;
    const candidateId = selectedCandidateId;

    setIsSavingEdit(true);
    setEditErrorMessage(null);
    setEditSuccessMessage(null);

    try {
      const updatedCandidate = await updateRecord(candidateId, {
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        position: values.position.trim(),
        status: selectedCandidate.status,
        stage: selectedCandidate.stage ?? undefined,
        linkedin_url: values.linkedin_url.trim() || undefined,
        cv_url: values.cv_url.trim() || undefined,
        experience_years: Number(values.experience_years),
      });

      if (selectedCandidateIdRef.current !== candidateId) return;
      updateCandidateInListAndDetail(updatedCandidate);
      setEditSuccessMessage("Candidatura actualizada correctamente.");
    } catch (error) {
      if (selectedCandidateIdRef.current !== candidateId) return;
      const message = error instanceof Error ? error.message : "No se pudo actualizar la candidatura.";
      setEditErrorMessage(message);
    } finally {
      if (selectedCandidateIdRef.current !== candidateId) return;
      setIsSavingEdit(false);
    }
  }

  async function handleUpdateStatus(nextStatus: CandidateStatus) {
    if (!selectedCandidateId) return;
    const candidateId = selectedCandidateId;

    setIsUpdatingStatus(true);
    setStatusUpdateError(null);
    setStatusUpdateSuccess(null);

    try {
      const payload =
        nextStatus === "pending"
          ? { status: "received" as CandidateStatus, stage: "pending" }
          : { status: nextStatus, stage: "review" };

      const updatedCandidate = await patchRecordStatus(candidateId, payload);
      if (selectedCandidateIdRef.current !== candidateId) return;
      updateCandidateInListAndDetail(updatedCandidate);
      setStatusUpdateSuccess("Estado actualizado correctamente.");
    } catch (error) {
      if (selectedCandidateIdRef.current !== candidateId) return;
      const message = error instanceof Error ? error.message : "No se pudo actualizar el estado.";
      setStatusUpdateError(message);
    } finally {
      if (selectedCandidateIdRef.current !== candidateId) return;
      setIsUpdatingStatus(false);
    }
  }

  function goToPreviousPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }

  function goToNextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto w-full max-w-7xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold sm:text-3xl">Talent Pipeline Tracker</h1>
          <p className="text-sm text-slate-600">Dashboard de candidatos - Brasaland</p>
        </header>

        <NewCandidateForm onCreated={refreshCandidatesAfterCreate} />

        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <StatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-semibold">Candidatos</h2>

            {isLoadingList && <p className="text-sm text-slate-600">Cargando candidatos...</p>}

            {listError && (
              <p className="rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700">{listError}</p>
            )}

            {!isLoadingList && !listError && !isSearchActive && candidates.length === 0 && (
              <p className="text-sm text-slate-600">No existen candidatos.</p>
            )}

            {!isLoadingList && !listError && filteredCandidates.length === 0 && (
              <p className="text-sm text-slate-600">No hay resultados para la búsqueda o filtro actual.</p>
            )}

            {!isLoadingList && !listError && filteredCandidates.length > 0 && (
              <CandidateList
                candidates={filteredCandidates}
                selectedCandidateId={selectedCandidateId}
                onSelect={handleSelectCandidate}
              />
            )}

            {!listError && !isSearchActive && (
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={currentPage <= 1 || isLoadingCandidates}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages || isLoadingCandidates}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <CandidateDetail
              key={selectedCandidateId ?? "none"}
              candidate={selectedCandidate}
              isLoadingDetail={isLoadingDetail}
              detailError={detailError}
              notes={notes}
              isLoadingNotes={isLoadingNotes}
              isSubmittingNote={isSubmittingNote}
              deletingNoteId={deletingNoteId}
              notesError={notesError}
              isSavingEdit={isSavingEdit}
              editSuccessMessage={editSuccessMessage}
              editErrorMessage={editErrorMessage}
              isUpdatingStatus={isUpdatingStatus}
              statusUpdateError={statusUpdateError}
              statusUpdateSuccess={statusUpdateSuccess}
              draftNote={draftNote}
              onDraftChange={setDraftNote}
              onSubmitNote={handleSubmitNote}
              onDeleteNote={handleDeleteNote}
              onSaveEdit={handleSaveEdit}
              onUpdateStatus={handleUpdateStatus}
              onClose={handleCloseDetail}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
