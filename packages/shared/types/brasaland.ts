export type País = "Colombia" | "Estados Unidos";

export type Ciudad = "Medellín" | "Bogotá" | "Cali" | "Miami" | "Orlando";

export type UbicaciónFavoritaBrasaland =
  | "Brasaland El Poblado"
  | "Brasaland Laureles"
  | "Brasaland Envigado"
  | "Brasaland Sabaneta"
  | "Brasaland Usaquén"
  | "Brasaland Chapinero"
  | "Brasaland Zona Rosa"
  | "Brasaland Granada"
  | "Brasaland Ciudad Jardín"
  | "Brasaland Unicentro"
  | "Brasaland Brickell"
  | "Brasaland Coral Gables"
  | "Brasaland Downtown"
  | "Brasaland International Drive";

export type PreferenciaAlimentaria =
  | "Sin restricciones"
  | "Vegetariano"
  | "Sin gluten"
  | "Otro";

export type CómoNosConociste =
  | "Redes sociales"
  | "Recomendación"
  | "Pasando por el local"
  | "Búsqueda en internet"
  | "Otro";

export interface RegistroBrasaPoints {
  nombreCompleto: string;
  email: string;
  teléfono: string;
  país: País;
  ciudad: Ciudad;
  ubicaciónFavorita?: UbicaciónFavoritaBrasaland;
  preferenciasAlimentarias?: PreferenciaAlimentaria[];
  cómoNosConociste: CómoNosConociste;
  fechaNacimiento: string;
  aceptoTérminosDelPrograma: boolean;
  quieroRecibirOfertasPorEmail?: boolean;
}

export const CIUDADES_POR_PAÍS: Record<País, Ciudad[]> = {
  Colombia: ["Medellín", "Bogotá", "Cali"],
  "Estados Unidos": ["Miami", "Orlando"]
};

export const UBICACIONES_POR_PAÍS_Y_CIUDAD: Record<
  País,
  Partial<Record<Ciudad, UbicaciónFavoritaBrasaland[]>>
> = {
  Colombia: {
    Medellín: [
      "Brasaland El Poblado",
      "Brasaland Laureles",
      "Brasaland Envigado",
      "Brasaland Sabaneta"
    ],
    Bogotá: ["Brasaland Usaquén", "Brasaland Chapinero", "Brasaland Zona Rosa"],
    Cali: ["Brasaland Granada", "Brasaland Ciudad Jardín", "Brasaland Unicentro"]
  },
  "Estados Unidos": {
    Miami: ["Brasaland Brickell", "Brasaland Coral Gables"],
    Orlando: ["Brasaland Downtown", "Brasaland International Drive"]
  }
};
