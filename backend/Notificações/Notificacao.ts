export type NotificationType = 'user' | 'owner' | 'admin' | 'report' | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}