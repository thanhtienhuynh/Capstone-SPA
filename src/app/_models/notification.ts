export interface NotificationDataSet {
  id: number;
  message: string;
  dateRecord: Date;
  isRead: boolean;
  data: string;
  userId: number;
  timeAgo: string;
  type: number;
  //1: New article
  //2: New rank
  //3: Update tt uni
}