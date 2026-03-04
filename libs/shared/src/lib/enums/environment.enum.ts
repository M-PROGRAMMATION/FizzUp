import { z } from 'zod'

export const Environment = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  LOCAL: 'local',
} as const;

export const EnvironmentEnum = z.enum(['production', 'development', 'local'])
export type Environment = z.infer<typeof EnvironmentEnum>;