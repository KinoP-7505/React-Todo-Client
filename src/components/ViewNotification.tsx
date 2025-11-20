import { Alert, Snackbar } from "@mui/material"
// import { useState } from "react";

type PropsNotification = {
  isOpen: boolean;
  message: string;
  mode: string;
  handleClose: () => void;
}

export const ViewNotification: React.FC<PropsNotification> = ({ isOpen, message, mode, handleClose }) => {
  // const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false); // アラート開閉
  // const [message, setMessage] = useState<string>(''); // 表示メッセージ
  // const [mode, setMode] = useState<string>(''); // Alertパターン

  const viewAlert = (mode: string) => {
    if (mode === "success") {
      return <Alert severity="success">{message}</Alert>
    } else if (mode === "error") {
      return <Alert severity="error">{message}</Alert>
    }
    return <Alert severity="success">{message}</Alert>
  }

  return (
    <>
      <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleClose}>
        {viewAlert(mode)}
      </Snackbar >
    </>
  )
}