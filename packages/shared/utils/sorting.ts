export type SortDirection = "asc" | "desc";

type Sortable = string | number | boolean | Date;

function normalizeValue(value: Sortable): string | number {
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  return value;
}

function compareValues(left: Sortable, right: Sortable): number {
  const normalizedLeft = normalizeValue(left);
  const normalizedRight = normalizeValue(right);

  if (normalizedLeft < normalizedRight) {
    return -1;
  }
  if (normalizedLeft > normalizedRight) {
    return 1;
  }
  return 0;
}

export function sortItems<T>(
  items: readonly T[],
  comparator: (left: T, right: T) => number,
  direction: SortDirection = "asc"
): T[] {
  const sorted = [...items].sort(comparator);
  if (direction === "desc") {
    sorted.reverse();
  }
  return sorted;
}

export function sortByField<T, K extends keyof T>(
  items: readonly T[],
  field: K,
  direction: SortDirection = "asc"
): T[] {
  return sortItems(
    items,
    (left, right) => compareValues(left[field] as Sortable, right[field] as Sortable),
    direction
  );
}
