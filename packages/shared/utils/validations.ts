import {
  CIUDADES_POR_PAÍS,
  UBICACIONES_POR_PAÍS_Y_CIUDAD,
  type Ciudad,
  type País,
  type RegistroBrasaPoints,
  type UbicaciónFavoritaBrasaland
} from "../types/brasaland";

export const MENSAJES_ERROR = {
  nombreCompleto: "Ingresa tu nombre completo (nombre y apellido)",
  email: "Ingresa un email válido (ejemplo: nombre@correo.com)",
  teléfono: "El teléfono debe incluir código de país (ejemplo: +57 300 123 4567 o +1 305 123 4567)",
  país: "Selecciona tu país",
  ciudad: "Selecciona tu ciudad",
  cómoNosConociste: "Cuéntanos cómo conociste Brasaland",
  fechaNacimiento: "Debes ser mayor de 18 años para registrarte en Brasa Points",
  aceptoTérminosDelPrograma: "Debes aceptar los términos del programa Brasa Points para continuar"
} as const;

export interface ResultadoValidación<TError> {
  esVálido: boolean;
  errores: Partial<TError>;
}

export interface ErroresRegistroBrasaPoints {
  nombreCompleto: string;
  email: string;
  teléfono: string;
  país: string;
  ciudad: string;
  cómoNosConociste: string;
  fechaNacimiento: string;
  aceptoTérminosDelPrograma: string;
}

export function getCiudadesPorPaís(país: País): Ciudad[] {
  return [...CIUDADES_POR_PAÍS[país]];
}

export function getUbicacionesPorPaísYCiudad(
  país: País,
  ciudad: Ciudad
): UbicaciónFavoritaBrasaland[] {
  return [...(UBICACIONES_POR_PAÍS_Y_CIUDAD[país][ciudad] ?? [])];
}

export function isCiudadVálidaParaPaís(país: País, ciudad: Ciudad): boolean {
  return CIUDADES_POR_PAÍS[país].includes(ciudad);
}

export function isUbicaciónVálida(
  país: País,
  ciudad: Ciudad,
  ubicación?: UbicaciónFavoritaBrasaland
): boolean {
  if (!ubicación) {
    return true;
  }
  return getUbicacionesPorPaísYCiudad(país, ciudad).includes(ubicación);
}

function isNombreCompletoVálido(nombreCompleto: string): boolean {
  const tokens = nombreCompleto.trim().split(/\s+/).filter(Boolean);
  return tokens.length >= 2;
}

function isEmailVálido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isTeléfonoVálido(país: País, teléfono: string): boolean {
  const value = teléfono.trim();
  if (país === "Colombia") {
    return value.startsWith("+57 ") && /^\+57\s[\d\s-]+$/.test(value);
  }
  return value.startsWith("+1 ") && /^\+1\s[\d\s-]+$/.test(value);
}

function isMayorDe18(fechaNacimiento: string, referencia: Date = new Date()): boolean {
  const nacimiento = new Date(fechaNacimiento);
  if (Number.isNaN(nacimiento.getTime())) {
    return false;
  }

  let edad = referencia.getFullYear() - nacimiento.getFullYear();
  const monthDiff = referencia.getMonth() - nacimiento.getMonth();
  const dayDiff = referencia.getDate() - nacimiento.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    edad -= 1;
  }

  return edad >= 18;
}

export function validarRegistroBrasaPoints(
  registro: RegistroBrasaPoints,
  referencia: Date = new Date()
): ResultadoValidación<ErroresRegistroBrasaPoints> {
  const errores: Partial<ErroresRegistroBrasaPoints> = {};

  if (!isNombreCompletoVálido(registro.nombreCompleto)) {
    errores.nombreCompleto = MENSAJES_ERROR.nombreCompleto;
  }

  if (!isEmailVálido(registro.email)) {
    errores.email = MENSAJES_ERROR.email;
  }

  if (!registro.país) {
    errores.país = MENSAJES_ERROR.país;
  }

  if (!registro.ciudad || !isCiudadVálidaParaPaís(registro.país, registro.ciudad)) {
    errores.ciudad = MENSAJES_ERROR.ciudad;
  }

  if (!isTeléfonoVálido(registro.país, registro.teléfono)) {
    errores.teléfono = MENSAJES_ERROR.teléfono;
  }

  if (!registro.cómoNosConociste) {
    errores.cómoNosConociste = MENSAJES_ERROR.cómoNosConociste;
  }

  if (!isMayorDe18(registro.fechaNacimiento, referencia)) {
    errores.fechaNacimiento = MENSAJES_ERROR.fechaNacimiento;
  }

  if (!registro.aceptoTérminosDelPrograma) {
    errores.aceptoTérminosDelPrograma = MENSAJES_ERROR.aceptoTérminosDelPrograma;
  }

  return {
    esVálido: Object.keys(errores).length === 0,
    errores
  };
}
