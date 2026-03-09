import { z } from 'zod';
import { userSchema } from './user.interface';

export const notificationsSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  isRead: z.boolean(),
  user: userSchema,
});

export type Notifications = z.infer<typeof notificationsSchema>;
