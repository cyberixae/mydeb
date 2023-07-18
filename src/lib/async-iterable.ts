export async function* fromArray<T>(xs: Array<T>): AsyncIterable<T> {
  yield* xs;
}
