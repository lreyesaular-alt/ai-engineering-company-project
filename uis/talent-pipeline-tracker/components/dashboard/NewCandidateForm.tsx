import { createRecord } from "@/lib/api";
import { CreateCandidatePayload } from "@/types/candidates";
import { FormEvent, useMemo, useState } from "react";

interface FormValues {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  stage: string;
  experience_years: string;
  linkedin_url: string;
  cv_url: string;
}

interface NewCandidateFormProps {
  onCreated: () => Promise<void>;
}

const INITIAL_VALUES: FormValues = {
  full_name: "",
  email: "",
  phone: "",
  position: "",
  status: "received",
  stage: "pending",
  experience_years: "",
  linkedin_url: "",
  cv_url: "",
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.full_name.trim()) {
    errors.full_name = "El nombre completo es obligatorio.";
  }

  if (!values.email.trim()) {
    errors.email = "El email es obligatorio.";
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = "Ingresa un email válido.";
  }

  if (!values.phone.trim()) {
    errors.phone = "El teléfono es obligatorio.";
  }

  if (!values.position.trim()) {
    errors.position = "La posición es obligatoria.";
  }

  if (!values.status.trim()) {
    errors.status = "El estado es obligatorio.";
  }

  if (!values.stage.trim()) {
    errors.stage = "La etapa es obligatoria.";
  }

  if (!values.experience_years.trim()) {
    errors.experience_years = "Los años de experiencia son obligatorios.";
  } else {
    const parsed = Number(values.experience_years);
    if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
      errors.experience_years = "Ingresa un número entero mayor o igual a 0.";
    }
  }

  return errors;
}

export function NewCandidateForm({ onCreated }: NewCandidateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

  function updateValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSubmitSuccess(null);
    setSubmitError(null);
  }

  function handleCancel() {
    if (isSubmitting) return;
    setIsOpen(false);
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitError(null);
    setSubmitSuccess(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload: CreateCandidatePayload = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      position: values.position.trim(),
      status: values.status.trim(),
      stage: values.stage.trim(),
      experience_years: Number(values.experience_years),
      linkedin_url: values.linkedin_url.trim() || undefined,
      cv_url: values.cv_url.trim() || undefined,
    };

    setIsSubmitting(true);

    try {
      await createRecord(payload);
      await onCreated();
      setSubmitSuccess("Candidatura creada correctamente.");
      setValues(INITIAL_VALUES);
      setErrors({});
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear la candidatura.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Nueva candidatura</h2>
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Abrir formulario
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500"
          >
            Cerrar
          </button>
        )}
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">
              Nombre completo *
            </label>
            <input
              id="full_name"
              type="text"
              value={values.full_name}
              onChange={(event) => updateValue("full_name", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isSubmitting}
            />
            {errors.full_name && (
              <p role="alert" className="mt-1 text-sm text-rose-700">
                {errors.full_name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => updateValue("email", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-sm text-rose-700">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
              Teléfono *
            </label>
            <input
              id="phone"
              type="tel"
              value={values.phone}
              onChange={(event) => updateValue("phone", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p role="alert" className="mt-1 text-sm text-rose-700">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-slate-700">
              Posición *
            </label>
            <input
              id="position"
              type="text"
              value={values.position}
              onChange={(event) => updateValue("position", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isSubmitting}
            />
            {errors.position && (
              <p role="alert" className="mt-1 text-sm text-rose-700">
                {errors.position}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="experience_years" className="block text-sm font-medium text-slate-700">
              Años de experiencia *
            </label>
            <input
              id="experience_years"
              type="number"
              min={0}
              step={1}
              value={values.experience_years}
              onChange={(event) => updateValue("experience_years", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isSubmitting}
            />
            {errors.experience_years && (
              <p role="alert" className="mt-1 text-sm text-rose-700">
                {errors.experience_years}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700">
              Status *
            </label>
            <select
              id="status"
              value={values.status}
              onChange={(event) => updateValue("status", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isSubmitting}
            >
              <option value="received">received</option>
              <option value="in_progress">in_progress</option>
              <option value="selected">selected</option>
              <option value="discarded">discarded</option>
            </select>
            {errors.status && (
              <p role="alert" className="mt-1 text-sm text-rose-700">
                {errors.status}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-slate-700">
              Stage *
            </label>
            <select
              id="stage"
              value={values.stage}
              onChange={(event) => updateValue("stage", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isSubmitting}
            >
              <option value="pending">pending</option>
              <option value="review">review</option>
            </select>
            {errors.stage && (
              <p role="alert" className="mt-1 text-sm text-rose-700">
                {errors.stage}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-slate-700">
              LinkedIn (opcional)
            </label>
            <input
              id="linkedin_url"
              type="url"
              value={values.linkedin_url}
              onChange={(event) => updateValue("linkedin_url", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="cv_url" className="block text-sm font-medium text-slate-700">
              CV URL (opcional)
            </label>
            <input
              id="cv_url"
              type="url"
              value={values.cv_url}
              onChange={(event) => updateValue("cv_url", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Guardando..." : "Crear candidatura"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>

          {submitSuccess && (
            <p
              role="status"
              aria-live="polite"
              className="sm:col-span-2 rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-700"
            >
              {submitSuccess}
            </p>
          )}
          {submitError && (
            <p
              role="alert"
              className="sm:col-span-2 rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700"
            >
              {submitError}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
