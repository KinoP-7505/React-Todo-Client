import { format } from 'date-fns';

// 日付を操作するユーティリティ
export const utilDate = {
  // 現在日時を返却
  nowDate: (): string => {
    const now = new Date();
    const formattedDate: string = format(now, 'yyyy-MM-dd HH:mm:ss');
    return formattedDate;
  }
}