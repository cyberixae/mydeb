import type { NonEmptyArray } from '../lib/non-empty-array';

export type StructKey = string;
export const examplesStructKey: NonEmptyArray<StructKey> = ['Status'];

export type StructValue = string;
export const examplesStructValue: NonEmptyArray<StructValue> = ['install ok installed'];

export type Struct = Record<StructKey, Array<StructValue>>;
export const examplesStruct: NonEmptyArray<Struct> = [
  {
    Package: ['test123'],
    Description: [
      'test123 is cool package',
      ' it is indeed cool',
      ' maybe the best package ever',
    ],
    Depends: ['test456'],
    Status: ['install ok installed'],
    Extra: ['something we do not necessarily care about'],
  },
];
