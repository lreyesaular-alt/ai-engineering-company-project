import {
  CandidateListResponse,
  CandidateNote,
  CandidateNotesResponse,
  CandidateRecord,
  CreateCandidatePayload,
  PatchCandidateStatusPayload,
  UpdateCandidatePayload,
} from "@/types/candidates";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL no está configurada.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;

    try {
      const errorBody = (await response.json()) as { error?: string; message?: string };
      message = errorBody.error ?? errorBody.message ?? message;
    } catch {
      // Si la API no devuelve JSON, mantenemos el mensaje por defecto.
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export async function getRecords(): Promise<CandidateRecord[]> {
  const firstPage = await request<CandidateListResponse>("/records");
  const firstPageData = firstPage.data ?? [];
  const effectiveLimit = firstPage.limit > 0 ? firstPage.limit : Math.max(firstPageData.length, 1);
  const totalPages = Math.max(1, Math.ceil(firstPage.total / effectiveLimit));
  const currentPage = firstPage.page > 0 ? firstPage.page : 1;

  const pagesToFetch: number[] = [];
  for (let page = 1; page <= totalPages; page += 1) {
    if (page !== currentPage) {
      pagesToFetch.push(page);
    }
  }

  const remainingPages = await Promise.all(
    pagesToFetch.map((page) => request<CandidateListResponse>(`/records?page=${page}&limit=${effectiveLimit}`)),
  );

  const recordsById = new Map<string, CandidateRecord>();
  const allPages = [firstPage, ...remainingPages];

  for (const pageData of allPages) {
    for (const record of pageData.data ?? []) {
      if (!recordsById.has(record.id)) {
        recordsById.set(record.id, record);
      }
    }
  }

  return Array.from(recordsById.values());
}

export async function getRecordsPage(page: number, limit: number): Promise<CandidateListResponse> {
  return request<CandidateListResponse>(`/records?page=${page}&limit=${limit}`);
}

export async function getRecordById(id: string): Promise<CandidateRecord> {
  return request<CandidateRecord>(`/records/${id}`);
}

export async function createRecord(payload: CreateCandidatePayload): Promise<CandidateRecord> {
  return request<CandidateRecord>("/records", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRecord(id: string, payload: UpdateCandidatePayload): Promise<CandidateRecord> {
  return request<CandidateRecord>(`/records/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function patchRecordStatus(
  id: string,
  payload: PatchCandidateStatusPayload,
): Promise<CandidateRecord> {
  return request<CandidateRecord>(`/records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getRecordNotes(id: string): Promise<CandidateNote[]> {
  const data = await request<CandidateNotesResponse>(`/records/${id}/notes`);
  return data.data ?? [];
}

export async function addRecordNote(id: string, content: string): Promise<CandidateNote | null> {
  const data = await request<CandidateNote | { data?: CandidateNote }>(`/records/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  if ("id" in data) {
    return data;
  }

  return data.data ?? null;
}

export async function deleteRecordNote(id: string, noteId: string): Promise<void> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL no está configurada.");
  }

  const response = await fetch(`${API_URL}/records/${id}/notes/${noteId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;

    try {
      const errorBody = (await response.json()) as { error?: string; message?: string };
      message = errorBody.error ?? errorBody.message ?? message;
    } catch {
      // Si la API no devuelve JSON, mantenemos el mensaje por defecto.
    }

    throw new ApiError(message, response.status);
  }
}

export { ApiError };
