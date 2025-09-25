import { z } from 'zod/mini';

export const inputSchema = z.object({
  current: z.string(),
  prefix: z.optional(z.string()),
  type: z.enum(['major', 'minor', 'patch']),
});

export type Inputs = z.infer<typeof inputSchema>;
