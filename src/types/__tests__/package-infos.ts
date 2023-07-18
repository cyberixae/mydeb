import type { PackageInfos } from '../package-infos';
import * as PackageInfos_ from '../package-infos';
import * as AsyncIterable_ from '../../lib/async-iterable';
import * as ExtendedDescription_ from '../extended-description';

describe('PackageInfos', () => {
  describe('fromLines function', () => {
    it('fromLines function', async () => {
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
      ]);
      const infos = await PackageInfos_.fromLines(lines);
      const expected: PackageInfos = [
        {
          packageId: 'test123',
          description: {
            synopsis: 'test123 is cool package',
            extended: [
              ExtendedDescription_.paragraph(
                'it is indeed cool',
                'maybe the best package ever',
              ),
              ExtendedDescription_.blank,
              ExtendedDescription_.verbatim('* bullet1', '* bullet2'),
              ExtendedDescription_.blank,
              ExtendedDescription_.paragraph('More text'),
              ExtendedDescription_.paragraph('Final text'),
            ],
          },
          dependencies: [['test123', 'test456'], ['test789']],
          installationStatus: true,
        },
      ];
      expect(infos).toStrictEqual(expected);
    });
  });
});
