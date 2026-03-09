import { z } from 'zod'

export const UserRole = {
  USER: 'user',
  MOD: 'mod',
  ADMIN: 'admin',
} as const;

export const UserRoleEnum = z.enum(['user', 'mod', 'admin'])
export type UserRole = z.infer<typeof UserRoleEnum>;