import { Inputs } from './types';

export function calculateNextVersion({ current, prefix, type }: Inputs) {
  // Strip the prefix from the version.
  const unprefixedCurrentVersion =
    prefix && current.startsWith(prefix)
      ? current.slice(prefix.length)
      : current;

  // Decompose the version.
  const [major, minor, patch] = unprefixedCurrentVersion
    .split('.')
    .map((part) => parseInt(part));

  // Increment the version.
  const majorInc = type === 'major' ? 1 : 0;
  const minorInc = type === 'minor' ? 1 : 0;
  const patchInc = type === 'patch' ? 1 : 0;
  const nextVersion = [
    major + majorInc,
    minor + minorInc,
    patch + patchInc,
  ].join('.');
  return `${prefix || ''}${nextVersion}`;
}
