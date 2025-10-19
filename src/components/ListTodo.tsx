import { Button, Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { OperationComponentProps, TodoItem, TodoListProps } from "../util/TodoTypes";
import { format } from "date-fns";
import { useCallback } from "react";
import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


// Todo一覧コンポーネント
export const ListTodo: React.FC<TodoListProps> = ({
  todoList, operationComponent: OperationComponent, operationCallback,
}) => {
  const stableEdit = useCallback(operationCallback, [operationCallback]);

  const viewDateConversion = (item: TodoItem) => {
    let dateNum = item.createdAt; // 作成日
    // 更新日が有る場合、表示日付＝更新日
    if (item.updatedAt > 0) {
      dateNum = item.updatedAt
    }
    // 数値を表示日付に変換
    const date = new Date(dateNum);
    const formattedDate = format(date, 'yy/MM/dd HH:mm:ss');
    return formattedDate;
  }


  return (
    <TableContainer component={Paper}
      sx={{ width: 800, maxHeight: 500, overflow: 'auto' }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: 100 }}>index</TableCell>
            <TableCell align="left" sx={{ width: 400 }}>Todo</TableCell>
            <TableCell align="center" sx={{ width: 200 }}>更新日</TableCell>
            <TableCell align="center" sx={{ width: 100 }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            todoList.map((todo: TodoItem) => (
              <>
                <TableRow>
                  <TableCell align="center">{todo.todoId}</TableCell>
                  <TableCell align="left">{todo.todoText}</TableCell>
                  <TableCell align="left">{viewDateConversion(todo)}</TableCell>
                  <TableCell align="center">
                    <OperationComponent todo={todo} operationCallback={stableEdit} />
                  </TableCell>
                </TableRow>
              </>
            ))
          }
        </TableBody >
      </Table>
    </TableContainer>
  )
}


// 操作用Props TodoNow
// export const OperationNow: React.FC<OperationComponentProps> = (
export const OperationNow = React.memo((
  { todo,
    // operationCallback: (operation: string, data: TodoItem) => void; // 汎用コールバック
    operationCallback,
  }: OperationComponentProps
) => {
  const handleCheckChange = () => {
    // Node.jsのライブラリでTodoのコピー
    const workTodo = structuredClone(todo);
    workTodo.isStatus1 = !todo.isStatus1 // boolean反転
    // callback設定
    operationCallback('checkbox', workTodo);
  }

  const handleOnEdit = () => {
    // callback設定
    operationCallback('edit', todo);
  }

  return (
    <>
      <IconButton aria-label="edit" onClick={handleOnEdit}>
        <EditIcon />
      </IconButton>
      <Checkbox checked={todo.isStatus1} onChange={handleCheckChange} />
    </>
  )
})

// 操作用Props TodoComp
// export const OperationComp: React.FC<OperationComponentProps> = (
export const OperationComp = React.memo((
  { todo,
    operationCallback,
  }: OperationComponentProps
) => {
  const handleCheckChange = () => {
    // Node.jsのライブラリでTodoのコピー
    const workTodo = structuredClone(todo);
    workTodo.isStatus1 = !todo.isStatus1 // boolean反転
    // callback設定
    operationCallback('checkbox', workTodo);
  }

  const handleSendDelete = () => {
    operationCallback('delete', todo);
  }

  return (
    <>
      <Checkbox checked={todo.isStatus1} onChange={handleCheckChange} />
      <IconButton aria-label="edit" onClick={handleSendDelete}>
        <DeleteIcon />
      </IconButton>
    </>
  )
})