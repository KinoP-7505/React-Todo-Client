import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { DialogEditProps, TodoItem } from "../util/TodoTypes";
import { useEffect, useState } from "react";
import { DialogConfirm } from "./DialogConfirm";

export const DialogEdit: React.FC<DialogEditProps> = ({
  todo, isOpen, onClose, onUpdate, onDelete
}) => {
  // 編集文字列
  const [text, setText] = useState<string>('');

  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false); // Dialog状態（開閉）

  // isOpenが更新された時に1回実行する
  useEffect(() => {
    if (isOpen) {
      // 変更前テキストを代入
      setText(todo.todoText)
    }
  }, [isOpen])

  // todoのtextを更新したtodoオブジェクトを返す
  const updateTodo = (txt: string) => {
    const returnTodo: TodoItem = JSON.parse(JSON.stringify(todo));
    returnTodo.todoText = txt
    return returnTodo
  }

  return (
    <>
      {/* Todo編集ダイアログ */}
      <Dialog open={isOpen} onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              width: '80%', // 幅をビューポートの80%に設定
              height: '100%', // 高さをビューポートの100%に設定
              maxWidth: '500px', // 最大幅を600pxに設定
              maxHeight: '200px', // 最大高さを300pxに設定
            },
          },
        }}
      >
        <DialogTitle>Todo編集</DialogTitle>
        <DialogContent>
          <TextField id="todo-input" label="Todo" variant="standard"
            sx={{ width: 400 }}
            onChange={(e) => {
              setText(e.target.value)
            }}
            value={text}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => onUpdate(updateTodo(text))}>更新</Button>
          <Button onClick={() => setIsOpenConfirm(true)}>削除</Button>
        </DialogActions>
      </Dialog >

      {/* 削除確認 */}
      <DialogConfirm
        isOpen={isOpenConfirm} content="削除します。"
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={(confirm) => {
          if (confirm === 1) {
            onDelete(todo)
          }
          setIsOpenConfirm(false)
        }}
      />
    </>
  );
}