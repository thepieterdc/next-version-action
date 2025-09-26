import { calculateNextVersion } from '../src/utils.js';

describe('utils', () => {
  describe('calculateNextVersion', () => {
    it.each([
      { current: '1.0.0', next: '2.0.0', releaseType: 'major' as const },
      { current: '1.1.1', next: '2.0.0', releaseType: 'major' as const },
      { current: '1.0.1', next: '1.1.0', releaseType: 'minor' as const },
      { current: '1.0.0', next: '1.1.0', releaseType: 'minor' as const },
      { current: '1.0.0', next: '1.0.1', releaseType: 'patch' as const },
    ])(
      'should return $next for a $releaseType update of $current',
      ({ current, next, releaseType }) => {
        expect(
          calculateNextVersion({
            current,
            releaseType,
          }),
        ).toBe(next);
      },
    );

    it('should handle prefixes correctly', () => {
      expect(
        calculateNextVersion({
          current: '1.0.0',
          prefix: 'pfix',
          releaseType: 'major',
        }),
      ).toBe('pfix2.0.0');
    });
  });
});
