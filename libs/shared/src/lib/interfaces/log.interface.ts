import { z } from 'zod';
import { LogLevelEnum, LogCategoryEnum } from '../enums/log.enum';

export const LogEntrySchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string(),
  level: LogLevelEnum,
  category: LogCategoryEnum,
  message: z.string(),
  actor: z.string().optional(),
  target: z.string().optional(),
  ip: z.string().optional(),
  details: z.string().optional(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;
