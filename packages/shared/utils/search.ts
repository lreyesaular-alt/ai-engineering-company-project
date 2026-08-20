export interface SearchResult<T> {
  item?: T;
  index: number;
}

export function linearSearch<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean
): SearchResult<T> {
  for (let index = 0; index < items.length; index += 1) {
    if (predicate(items[index], index)) {
      return { item: items[index], index };
    }
  }

  return { item: undefined, index: -1 };
}

export function exactMatchByField<T, K extends keyof T>(
  items: readonly T[],
  field: K,
  value: T[K]
): SearchResult<T> {
  return linearSearch(items, (item) => item[field] === value);
}

export function partialTextSearch<T>(
  items: readonly T[],
  selector: (item: T) => string,
  text: string
): T[] {
  const normalizedText = text.trim().toLocaleLowerCase();
  if (!normalizedText) {
    return [];
  }

  return items.filter((item) => selector(item).toLocaleLowerCase().includes(normalizedText));
}

export function binarySearchByField<T, K extends keyof T>(
  sortedItems: readonly T[],
  field: K,
  value: T[K],
  compare: (left: T[K], right: T[K]) => number
): SearchResult<T> {
  let low = 0;
  let high = sortedItems.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const comparison = compare(sortedItems[mid][field], value);

    if (comparison === 0) {
      return { item: sortedItems[mid], index: mid };
    }

    if (comparison < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return { item: undefined, index: -1 };
}
