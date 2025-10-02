import { Inputs } from './types.js';

export function calculateNextVersion({
  current,
  releaseType,
  template,
}: Inputs) {
  // Transform the template into a regex.
  const regex = template.replaceAll(/{([A-Za-z]+)}/g, '(?<$1>[0-9]+)');

  // Decompose the current version using the template.
  const components = current.match(new RegExp(regex));
  if (
    !components ||
    !components.groups ||
    Object.values(components.groups).every((v) => !v)
  ) {
    throw new Error(
      `Current version ${current} does not match template ${template}`,
    );
  }

  // Build the next version.
  const precedences = Object.fromEntries(
    Object.keys(components.groups).map((c, i) => [c, i]),
  );
  const nextVersion: Record<string, number> = {};
  for (const [type, value] of Object.entries(components.groups)) {
    nextVersion[type] = parseInt(value || '0');
    if (type === releaseType) {
      nextVersion[type] = nextVersion[type] + 1;
    } else if (precedences[releaseType] < precedences[type]) {
      nextVersion[type] = 0;
    }
  }

  // // Update the current version.
  // const nextVersion = { major, minor, patch } as Record<ReleaseType, number>;
  // for (const [type, value] of Object.entries(nextVersion)) {
  //   if (type === releaseType) {
  //     nextVersion[type] = value + 1;
  //     // @ts-expect-error cannot type
  //   } else if (PARTS_PRECEDENCE[releaseType] < PARTS_PRECEDENCE[type]) {
  //     nextVersion[type as ReleaseType] = 0;
  //   }
  // }
  //
  // // Build the final version.
  // return `${prefix || ''}${nextVersion.major}.${nextVersion.minor}.${nextVersion.patch}`;
  return 'test';
}
