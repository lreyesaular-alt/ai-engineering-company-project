import { groupItemsBy } from "./collections";
import type { Ciudad, CómoNosConociste, País, RegistroBrasaPoints } from "../types/brasaland";

export function countItems<T>(items: readonly T[]): number {
  return items.length;
}

export function sumBy<T>(items: readonly T[], selector: (item: T) => number): number {
  return items.reduce((sum, item) => sum + selector(item), 0);
}

export function averageBy<T>(items: readonly T[], selector: (item: T) => number): number {
  if (items.length === 0) {
    return 0;
  }
  return sumBy(items, selector) / items.length;
}

export function minBy<T>(items: readonly T[], selector: (item: T) => number): number | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items.reduce((minValue, item) => {
    const value = selector(item);
    return value < minValue ? value : minValue;
  }, selector(items[0]));
}

export function maxBy<T>(items: readonly T[], selector: (item: T) => number): number | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items.reduce((maxValue, item) => {
    const value = selector(item);
    return value > maxValue ? value : maxValue;
  }, selector(items[0]));
}

export function countBy<T, K extends PropertyKey>(
  items: readonly T[],
  keySelector: (item: T) => K
): Record<K, number> {
  const grouped = groupItemsBy(items, keySelector);
  const keys = Object.keys(grouped) as K[];

  return keys.reduce((acc, key) => {
    acc[key] = grouped[key].length;
    return acc;
  }, {} as Record<K, number>);
}

function computeAge(fechaNacimiento: string, referencia: Date = new Date()): number {
  const nacimiento = new Date(fechaNacimiento);
  if (Number.isNaN(nacimiento.getTime())) {
    return 0;
  }

  let edad = referencia.getFullYear() - nacimiento.getFullYear();
  const monthDiff = referencia.getMonth() - nacimiento.getMonth();
  const dayDiff = referencia.getDate() - nacimiento.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    edad -= 1;
  }

  return edad;
}

export interface ResumenRegistrosBrasaPoints {
  totalRegistros: number;
  porPaís: Record<País, number>;
  porCiudad: Partial<Record<Ciudad, number>>;
  porFuente: Partial<Record<CómoNosConociste, number>>;
  promedioEdad: number;
  edadMínima: number;
  edadMáxima: number;
}

export function aggregateRegistrosBrasaPoints(
  registros: readonly RegistroBrasaPoints[],
  referencia: Date = new Date()
): ResumenRegistrosBrasaPoints {
  const edades = registros.map((registro) => computeAge(registro.fechaNacimiento, referencia));

  return {
    totalRegistros: countItems(registros),
    porPaís: {
      Colombia: registros.filter((registro) => registro.país === "Colombia").length,
      "Estados Unidos": registros.filter((registro) => registro.país === "Estados Unidos").length
    },
    porCiudad: countBy(registros, (registro) => registro.ciudad),
    porFuente: countBy(registros, (registro) => registro.cómoNosConociste),
    promedioEdad: averageBy(edades, (edad) => edad),
    edadMínima: minBy(edades, (edad) => edad) ?? 0,
    edadMáxima: maxBy(edades, (edad) => edad) ?? 0
  };
}
