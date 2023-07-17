export function absurd(_never: never, reason: string = 'absurd call'): never {
  throw new Error(reason);
}
