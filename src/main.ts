import * as core from '@actions/core';
import { z } from 'zod';
import { inputSchema } from './types.js';
import { calculateNextVersion } from './utils.js';

/**
 * Main function.
 */
export async function run(): Promise<void> {
  try {
    // Parse the inputs.
    const inputs = inputSchema.parse({
      current: core.getInput('current'),
      releaseType: core.getInput('releaseType'),
      template: core.getInput('template'),
    });
    if (!inputs.template.includes(`{${inputs.releaseType}}`)) {
      throw new Error(`Invalid template, must contain {${inputs.releaseType}}`);
    }

    // Calculate the next version.
    const nextVersion = calculateNextVersion(inputs);

    // Set the new version as an output.
    core.setOutput('next', nextVersion);
  } catch (e) {
    if (e instanceof z.ZodError) {
      for (const issue of e.issues) {
        if (issue.code === 'invalid_value') {
          core.error(
            `Invalid input (${issue.path.join('.')}): must be one of ${issue.values}`,
          );
        } else {
          core.error(
            `Invalid input (${issue.path.join('.')}): ${issue.message}`,
          );
        }
      }
    } else {
      core.setFailed(`${e}`);
    }
  }
}
