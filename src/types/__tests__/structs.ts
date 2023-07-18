import * as AsyncIterable_ from '../../lib/async-iterable';
import type { Structs } from '../structs';
import * as Structs_ from '../structs';

describe('Structs', () => {
  describe('fromLines function', () => {
    it('should parse structs from lines', async () => {
      const lines = AsyncIterable_.fromArray([
        'Package: test123',
        'Description: test123 is cool package',
        ' it is indeed cool',
        ' maybe the best package ever',
        ' .',
        '  * bullet1',
        '  * bullet2',
        ' .',
        ' More text',
        ' .future expansion',
        ' Final text',
        'Depends: test123 | test456 (>= 1.23), test789',
        'Status: install ok installed',
        'Extra: something we do not necessarily care about',
        '',
        'Foo: bar',
        '',
      ]);
      const structs = await Structs_.fromLines(lines);
      const expected: Structs = [
        {
          Package: ['test123'],
          Description: [
            'test123 is cool package',
            ' it is indeed cool',
            ' maybe the best package ever',
            ' .',
            '  * bullet1',
            '  * bullet2',
            ' .',
            ' More text',
            ' .future expansion',
            ' Final text',
          ],
          Depends: ['test123 | test456 (>= 1.23), test789'],
          Status: ['install ok installed'],
          Extra: ['something we do not necessarily care about'],
        },
        {
          Foo: ['bar'],
        },
      ];
      expect(structs).toStrictEqual(expected);
    });
  });
});
