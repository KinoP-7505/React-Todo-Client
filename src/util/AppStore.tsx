import { create } from "zustand";

/**
 * アプリ共通のzustandStore
 */
type AppState = {
  isNotificationOpen: boolean;
  setIsNotificationOpen: (flg: boolean) => void;
  notificationMessage: string;
  setNotificationMessage: (message: string) => void;
  notificationMode: string;
  setNotificationMode: (mode: string) => void;
  openNotification: (mode: string, message: string) => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  isNotificationOpen: false,
  setIsNotificationOpen: (flg) => set(() => ({ isNotificationOpen: flg })),
  notificationMessage: 'message',
  setNotificationMessage: (message) => set(() => ({ notificationMessage: message })),
  notificationMode: 'success',
  setNotificationMode: (mode: string) => set(() => ({ notificationMode: mode })),
  openNotification: (mode: string, message: string) => set(() => ({
    isNotificationOpen: true,
    notificationMode: mode,
    notificationMessage: message,
  })),
}));