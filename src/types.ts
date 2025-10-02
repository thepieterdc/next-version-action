import { z } from 'zod/mini';

export const inputSchema = z.object({
  current: z.string(),
  releaseType: z.string(),
  template: z.string(),
});

export type Inputs = z.infer<typeof inputSchema>;
