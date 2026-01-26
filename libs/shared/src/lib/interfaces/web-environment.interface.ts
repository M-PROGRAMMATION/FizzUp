import { z } from 'zod'
import { Environment } from '../enums';

export const webAppSchema = z.object({
  environment: z.nativeEnum(Environment),
  hostUrl: z.string(),
  apiUrl: z.string(),
});

export type WebAppEnvironment = z.infer<typeof webAppSchema>;