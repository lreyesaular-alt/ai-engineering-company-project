import assert from "node:assert/strict";
import test from "node:test";

import { filterItems, findItem, groupItemsBy } from "../utils/collections";
import { linearSearch, exactMatchByField, partialTextSearch, binarySearchByField } from "../utils/search";
import { sortByField } from "../utils/sorting";
import {
  countBy,
  countItems,
  sumBy,
  averageBy,
  minBy,
  maxBy,
  aggregateRegistrosBrasaPoints
} from "../utils/transformations";
import {
  MENSAJES_ERROR,
  getCiudadesPorPaís,
  getUbicacionesPorPaísYCiudad,
  validarRegistroBrasaPoints
} from "../utils/validations";
import type { RegistroBrasaPoints } from "../types/brasaland";

const registroBase: RegistroBrasaPoints = {
  nombreCompleto: "Ana Pérez",
  email: "ana@correo.com",
  teléfono: "+57 300 123 4567",
  país: "Colombia",
  ciudad: "Medellín",
  ubicaciónFavorita: "Brasaland El Poblado",
  preferenciasAlimentarias: ["Sin restricciones"],
  cómoNosConociste: "Redes sociales",
  fechaNacimiento: "1990-01-10",
  aceptoTérminosDelPrograma: true,
  quieroRecibirOfertasPorEmail: false
};

test("colecciones vacías se manejan correctamente", () => {
  assert.deepEqual(filterItems([], () => true), []);
  assert.equal(findItem([], () => true), undefined);
  assert.deepEqual(groupItemsBy([], (item: string) => item), {});
});

test("búsqueda lineal encuentra y no encuentra elementos", () => {
  const items = [1, 2, 3];
  assert.deepEqual(linearSearch(items, (item) => item === 2), { item: 2, index: 1 });
  assert.deepEqual(linearSearch(items, (item) => item === 9), { item: undefined, index: -1 });
});

test("búsqueda exacta y parcial funciona", () => {
  const items = [{ nombre: "Brasaland Miami" }, { nombre: "Brasaland Bogotá" }];

  assert.equal(exactMatchByField(items, "nombre", "Brasaland Bogotá").index, 1);
  assert.deepEqual(partialTextSearch(items, (item) => item.nombre, "miami"), [{ nombre: "Brasaland Miami" }]);
  assert.deepEqual(partialTextSearch(items, (item) => item.nombre, ""), []);
});

test("búsqueda binaria requiere colección ordenada", () => {
  const sorted = [{ valor: 1 }, { valor: 3 }, { valor: 8 }];
  const result = binarySearchByField(sorted, "valor", 3, (left, right) => left - right);
  assert.equal(result.index, 1);

  const missing = binarySearchByField(sorted, "valor", 2, (left, right) => left - right);
  assert.equal(missing.index, -1);
});

test("ordenamiento ascendente y descendente no muta original", () => {
  const original = [{ valor: 3 }, { valor: 1 }, { valor: 2 }];
  const asc = sortByField(original, "valor", "asc");
  const desc = sortByField(original, "valor", "desc");

  assert.deepEqual(asc.map((item) => item.valor), [1, 2, 3]);
  assert.deepEqual(desc.map((item) => item.valor), [3, 2, 1]);
  assert.deepEqual(original.map((item) => item.valor), [3, 1, 2]);
});

test("agrupación y agregaciones básicas", () => {
  const nums = [1, 2, 3, 4];
  assert.equal(countItems(nums), 4);
  assert.equal(sumBy(nums, (n) => n), 10);
  assert.equal(averageBy(nums, (n) => n), 2.5);
  assert.equal(minBy(nums, (n) => n), 1);
  assert.equal(maxBy(nums, (n) => n), 4);

  const grouped = countBy(
    [
      { país: "Colombia" },
      { país: "Estados Unidos" },
      { país: "Colombia" }
    ],
    (item) => item.país
  );
  assert.equal(grouped.Colombia, 2);
  assert.equal(grouped["Estados Unidos"], 1);
});

test("agregaciones por registros Brasa Points", () => {
  const registros: RegistroBrasaPoints[] = [
    registroBase,
    {
      ...registroBase,
      email: "luis@correo.com",
      nombreCompleto: "Luis Gómez",
      país: "Estados Unidos",
      ciudad: "Miami",
      teléfono: "+1 305 123 4567",
      ubicaciónFavorita: "Brasaland Brickell",
      cómoNosConociste: "Recomendación",
      fechaNacimiento: "1988-05-03"
    }
  ];

  const resumen = aggregateRegistrosBrasaPoints(registros, new Date("2026-08-20"));
  assert.equal(resumen.totalRegistros, 2);
  assert.equal(resumen.porPaís.Colombia, 1);
  assert.equal(resumen.porPaís["Estados Unidos"], 1);
  assert.equal(resumen.porCiudad.Medellín, 1);
  assert.equal(resumen.porFuente["Recomendación"], 1);
  assert.ok(resumen.promedioEdad >= 18);
});

test("validaciones válidas e inválidas", () => {
  const válido = validarRegistroBrasaPoints(registroBase, new Date("2026-08-20"));
  assert.equal(válido.esVálido, true);
  assert.deepEqual(válido.errores, {});

  const inválido = validarRegistroBrasaPoints(
    {
      ...registroBase,
      nombreCompleto: "Ana",
      email: "ana-correo.com",
      teléfono: "3001234567",
      ciudad: "Miami",
      fechaNacimiento: "2010-08-20",
      aceptoTérminosDelPrograma: false,
      cómoNosConociste: "" as RegistroBrasaPoints["cómoNosConociste"]
    },
    new Date("2026-08-20")
  );

  assert.equal(inválido.esVálido, false);
  assert.equal(inválido.errores.nombreCompleto, MENSAJES_ERROR.nombreCompleto);
  assert.equal(inválido.errores.email, MENSAJES_ERROR.email);
  assert.equal(inválido.errores.teléfono, MENSAJES_ERROR.teléfono);
  assert.equal(inválido.errores.ciudad, MENSAJES_ERROR.ciudad);
  assert.equal(inválido.errores.fechaNacimiento, MENSAJES_ERROR.fechaNacimiento);
  assert.equal(inválido.errores.aceptoTérminosDelPrograma, MENSAJES_ERROR.aceptoTérminosDelPrograma);
  assert.equal(inválido.errores.cómoNosConociste, MENSAJES_ERROR.cómoNosConociste);
});

test("caso límite de mayoría de edad exacta", () => {
  const borde = validarRegistroBrasaPoints(
    {
      ...registroBase,
      fechaNacimiento: "2008-08-20"
    },
    new Date("2026-08-20")
  );

  assert.equal(borde.esVálido, true);
});

test("reglas de listas dependientes", () => {
  assert.deepEqual(getCiudadesPorPaís("Colombia"), ["Medellín", "Bogotá", "Cali"]);
  assert.deepEqual(getUbicacionesPorPaísYCiudad("Estados Unidos", "Miami"), [
    "Brasaland Brickell",
    "Brasaland Coral Gables"
  ]);
});
