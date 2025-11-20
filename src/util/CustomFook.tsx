import { useState, useCallback } from 'react';

type ResolveFunction = (value: boolean) => void;

// 1. ダイアログの表示状態と解決/拒否関数を保持するフック
export const useConfirm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [resolvePromise, setResolvePromise] = useState<ResolveFunction | null>(null);

  // 2. 処理を中断し、ダイアログを表示してPromiseを返す関数
  const showConfirm = useCallback((mode: string, title: string, message: string): Promise<boolean> => {
    return new Promise((resolve: ResolveFunction) => {
      setDialogMode(mode);
      setDialogTitle(title);
      setDialogMessage(message);
      setIsDialogOpen(true);
      setResolvePromise(() => resolve); // resolve関数を保存
      // rejectは通常不要（キャンセル＝falseで解決）
    });
  }, []);
  const handleConfirm = useCallback((confirm: boolean) => {
    setIsDialogOpen(false); // ダイアログを非表示
    if (resolvePromise) {
      resolvePromise(confirm); // Promiseを 'true' で解決
      setResolvePromise(null);
    }
  }, [resolvePromise]);


  // // ダイアログの「はい(承認)」ボタンが押されたときの処理
  // const handleConfirm = useCallback(() => {
  //   setIsDialogOpen(false); // ダイアログを非表示
  //   if (resolvePromise) {
  //     resolvePromise(true); // Promiseを 'true' で解決
  //     setResolvePromise(null);
  //   }
  // }, [resolvePromise]);

  // // ダイアログの「いいえ(キャンセル)」ボタンが押されたときの処理
  // const handleClose = useCallback(() => {
  //   setIsDialogOpen(false); // ダイアログを非表示
  //   if (resolvePromise) {
  //     resolvePromise(false); // Promiseを 'false' で解決
  //     setResolvePromise(null);
  //   }
  // }, [resolvePromise]);

  // 4. モーダルコンポーネントに渡すPropsと、表示関数を返す
  return {
    isDialogOpen,
    dialogMode,
    dialogTitle,
    dialogMessage,
    showConfirm,
    handleConfirm, // Yes/Noの処理
    // handleClose, // No,ダイアログcloseの処理
  };
};
