import { Inputs, ReleaseType } from './types.js';

const PARTS_PRECEDENCE = Object.fromEntries(
  ['major', 'minor', 'patch'].map((type, idx) => [type, idx]),
) as Record<ReleaseType, number>;

export function calculateNextVersion({ current, prefix, releaseType }: Inputs) {
  // Strip the prefix from the version.
  const unprefixedCurrentVersion =
    prefix && current.startsWith(prefix)
      ? current.slice(prefix.length)
      : current;

  // Decompose the version.
  const [major, minor, patch] = unprefixedCurrentVersion
    .split('.')
    .map((part: string) => parseInt(part));

  // Update the current version.
  const nextVersion = { major, minor, patch } as Record<ReleaseType, number>;
  for (const [type, value] of Object.entries(nextVersion)) {
    if (type === releaseType) {
      nextVersion[type] = value + 1;
      // @ts-expect-error cannot type
    } else if (PARTS_PRECEDENCE[releaseType] < PARTS_PRECEDENCE[type]) {
      nextVersion[type as ReleaseType] = 0;
    }
  }

  // Build the final version.
  return `${prefix || ''}${nextVersion.major}.${nextVersion.minor}.${nextVersion.patch}`;
}
