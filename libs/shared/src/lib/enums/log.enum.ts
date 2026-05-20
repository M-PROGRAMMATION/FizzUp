import { z } from 'zod';

export const LogLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export const LogLevelEnum = z.enum(['info', 'warn', 'error', 'success']);
export type LogLevel = z.infer<typeof LogLevelEnum>;

export const LogCategory = {
  AUTH: 'auth',
  USER: 'user',
  DEVICE: 'device',
  SYSTEM: 'system',
  PAYMENT: 'payment',
  SECURITY: 'security',
  SOCIAL: 'social',
} as const;

export const LogCategoryEnum = z.enum(['auth', 'user', 'device', 'system', 'payment', 'security', 'social']);
export type LogCategory = z.infer<typeof LogCategoryEnum>;
