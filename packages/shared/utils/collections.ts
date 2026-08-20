export function filterItems<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): T[] {
  return items.filter(predicate);
}

export function mapItems<T, U>(items: readonly T[], mapper: (item: T, index: number) => U): U[] {
  return items.map(mapper);
}

export function findItem<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): T | undefined {
  for (let index = 0; index < items.length; index += 1) {
    if (predicate(items[index], index)) {
      return items[index];
    }
  }
  return undefined;
}

export function groupItemsBy<T, K extends PropertyKey>(
  items: readonly T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keySelector(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
