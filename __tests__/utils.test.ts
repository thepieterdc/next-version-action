import { calculateNextVersion } from '../src/utils.js';

describe('utils', () => {
  describe('calculateNextVersion', () => {
    it.each([
      { current: '1.0.0', next: '2.0.0', type: 'major' as const },
      { current: '1.0.0', next: '1.1.0', type: 'minor' as const },
      { current: '1.0.0', next: '1.0.1', type: 'patch' as const },
    ])(
      'should return $next for a $type update of $current',
      ({ current, next, type }) => {
        expect(
          calculateNextVersion({
            current,
            type,
          }),
        ).toBe(next);
      },
    );

    it('should handle prefixes correctly', () => {
      expect(
        calculateNextVersion({
          current: '1.0.0',
          prefix: 'pfix',
          type: 'major',
        }),
      ).toBe('pfix2.0.0');
    });
  });
});
