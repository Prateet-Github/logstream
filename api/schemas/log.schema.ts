import z from 'zod';

export const logSchema = z.object({
  service: z.string().min(1, "Service name is required"),
  level: z.enum(['INFO', 'WARN', 'ERROR', 'DEBUG', 'FATAL']),
  message: z.string().min(1, "Log message cannot be empty"),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type LogInput = z.infer<typeof logSchema>;