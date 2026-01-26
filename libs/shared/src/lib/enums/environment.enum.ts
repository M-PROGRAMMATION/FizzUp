import z from 'zod';

export const Environment = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  LOCAL: 'local',
} as const;

export const EnvironmentEnum = z.enum(Environment);
export type Environment = z.infer<typeof EnvironmentEnum>;