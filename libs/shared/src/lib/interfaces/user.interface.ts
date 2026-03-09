import { z } from 'zod'
import { UserRole } from '../enums';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(UserRole),
  refreshTokens: z.array(z.string()).optional(),
});

export type User = z.infer<typeof userSchema>;