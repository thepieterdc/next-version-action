import { Inputs } from './types.js';

export function calculateNextVersion({
  current,
  releaseType,
  template,
}: Inputs): string {
  // Transform the template into a regex by replacing {componentName} with named capture groups
  // Also handle optional parts in parentheses with a ?
  let regex = template
    .replace(/\(/g, '(?:') // Convert ( to a non-capturing group (?:
    .replace(/\{([A-Za-z]+)}/g, '(?<$1>[0-9]+)') // Convert {name} to named capture groups
    .replace(/\)\?/g, ')?'); // Keep optional groups as is

  // For optional parts, we need to make the capture groups optional too.
  regex = regex.replace(
    /\(\?:([^)]*\(\?<([^>]+)>[^)]*)\)\?/g,
    (_, content) => `(?:${content})?`,
  );

  // Decompose the current version using the template regex
  const components = current.match(new RegExp(`^${regex}$`));
  if (!components || !components.groups) {
    throw new Error(
      `Current version ${current} does not match template ${template}`,
    );
  }

  // Build the next version by parsing current values
  const nextVersion: Record<string, number> = {};

  // Get all component names from the template
  const componentNames = Array.from(
    template.matchAll(/\{([A-Za-z]+)}/g),
    (match) => match[1],
  );

  // Create precedence mapping based on order in template
  const precedences = Object.fromEntries(
    componentNames.map((name, index) => [name, index]),
  );

  // Initialize all components with their current values (or 0 if not present)
  for (const componentName of componentNames) {
    const currentValue = components.groups[componentName];
    nextVersion[componentName] = currentValue ? parseInt(currentValue) : 0;
  }

  // Find the release type component and increment it
  if (!(releaseType in nextVersion)) {
    throw new Error(
      `Release type '${releaseType}' not found in template '${template}'`,
    );
  }

  // Increment the specified release type
  nextVersion[releaseType] = nextVersion[releaseType] + 1;

  // Reset all components that come after the incremented component to 0
  const releasePrecedence = precedences[releaseType];
  for (const [componentName, precedence] of Object.entries(precedences)) {
    if (precedence > releasePrecedence) {
      nextVersion[componentName] = 0;
    }
  }

  // Build the final version string by replacing template placeholders
  let result = template;

  // Handle optional parts - if a component is 0 and it's in an optional part, remove the whole optional part
  const optionalPattern = /\(([^)]*)\)\?/g;
  result = result.replace(optionalPattern, (_, content) => {
    // Check if any component in this optional part has a value of 0
    const componentMatches = content.match(/\{([^}]+)}/g);
    if (componentMatches) {
      const hasNonZeroValue = componentMatches.some((comp: string) => {
        const componentName = comp.slice(1, -1); // Remove { and }
        return nextVersion[componentName] > 0;
      });

      if (hasNonZeroValue) {
        return content; // Keep the content without the optional wrapper
      } else {
        return ''; // Remove the entire optional part
      }
    }
    return content;
  });

  // Replace all remaining placeholders with their values
  result = result.replace(/\{([A-Za-z]+)}/g, (_, componentName) =>
    nextVersion[componentName].toString(),
  );

  return result;
}
