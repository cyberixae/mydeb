import { tuple } from '../tuple';
import * as Record_ from '../record';

describe('Record', () => {
  describe('collectKeyValuePairs function', () => {
    it('should turn key/value pairs into a record', async () => {
      const input = [tuple('foo', 123), tuple('bar', 456), tuple('foo', 789)];
      const result = Record_.collectKeyValuePairs(input);
      const expected: Record<string, Array<number>> = {
        foo: [123, 789],
        bar: [456],
      };
      expect(result).toStrictEqual(expected);
    });
  });
});
