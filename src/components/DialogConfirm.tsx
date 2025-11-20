import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { DialogConfirmProps } from "../util/TodoTypes";

// 確認ダイアログ
export const DialogConfirm: React.FC<DialogConfirmProps> = ({
  isOpen, mode, title, content, onClose, onConfirm
}) => {

  const ButtonItem = ({ mode }: { mode: string }) => {
    if (mode === 'confirm') {
      return <Button onClick={() => onConfirm(0)}>確認</Button>
    } else if (mode === 'select') {
      return (
        <>
          <Button onClick={() => onConfirm(0)}>いいえ</Button>
          <Button onClick={() => onConfirm(1)}>はい</Button>
        </>
      )
    }
    // 指定なければ確認
    return <Button onClick={() => onConfirm(0)}>確認</Button>
  }

  return (
    <Dialog open={isOpen} onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: '80%', // 幅をビューポートの80%に設定
            height: '100%', // 高さをビューポートの100%に設定
            maxWidth: '300px', // 最大幅を600pxに設定
            maxHeight: '180px', // 最大高さを300pxに設定
          },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        <ButtonItem mode={mode} />
      </DialogActions>
    </Dialog >

  )
}