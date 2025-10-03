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
            template: '{major}.{minor}.{patch}',
          }),
        ).toBe(next);
      },
    );

    it('should handle prefixes correctly', () => {
      expect(
        calculateNextVersion({
          current: 'pfix1.0.0',
          releaseType: 'major',
          template: 'pfix{major}.{minor}.{patch}',
        }),
      ).toBe('pfix2.0.0');
    });

    it.each([
      // Hotfix -> patch
      {
        current: '1.0.0-hotfix.1',
        next: '1.0.1',
        releaseType: 'patch',
      },
      // Hotfix -> minor
      {
        current: '1.0.0-hotfix.1',
        next: '1.1.0',
        releaseType: 'minor',
      },
      // Minor -> hotfix
      {
        current: '1.1.0',
        next: '1.1.0-hotfix.1',
        releaseType: 'hotfix',
      },
      // Hotfix -> Hotfix
      {
        current: '1.2.3-hotfix.1',
        next: '1.2.3-hotfix.2',
        releaseType: 'hotfix',
      },
      {
        current: '1.20.3-hotfix.14',
        next: '1.20.3-hotfix.15',
        releaseType: 'hotfix',
      },
    ])(
      'should handle optional suffixes correctly',
      ({ current, next, releaseType }) => {
        expect(
          calculateNextVersion({
            current,
            releaseType,
            template: '{major}.{minor}.{patch}(-hotfix.{hotfix})?',
          }),
        ).toBe(next);
      },
    );
  });
});
