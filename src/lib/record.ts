export function collectKeyValuePairs<K extends string, V>(
  kvs: Array<[K, V]>,
): Record<K, Array<V>> {
  const result: Record<K, Array<V>> = {} as any;
  for (const kv of kvs) {
    const [k, v] = kv;
    if (result.hasOwnProperty(k) === false) {
      result[k] = [];
    }
    result[k].push(v);
  }
  return result;
}
