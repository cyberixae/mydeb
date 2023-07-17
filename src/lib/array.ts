export async function fromAsync<T>(iterable: AsyncIterable<T>): Promise<Array<T>> {
  const values: Array<T> = [];
  for await (const i of iterable) {
    values.push(i);
  }
  return values;
}
