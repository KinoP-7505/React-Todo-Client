import { Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { TodoItem, TodoListProps } from "../util/TodoTypes";
import EditIcon from '@mui/icons-material/Edit';
import { format } from "date-fns";

// Todo一覧コンポーネント
export const TodoList: React.FC<TodoListProps> = ({
  todoList, onEditTodo, onChangeTodoComp
}) => {

  return (
    <>
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
              todoList.map((todo: TodoItem, idx: number) => (
                <>
                  <TodoLine key={`linekey_${idx}`}
                    todo={todo}
                    onEdit={() => onEditTodo(todo)}
                    onChangeComp={() => onChangeTodoComp(todo)}
                  />
                </>
              ))
            }
          </TableBody >
        </Table>
      </TableContainer>
    </>
  )
}

// 一覧行用Props
type propsTodoline = {
  key: string
  todo: TodoItem,
  onEdit: () => void;
  onChangeComp: () => void;
}

// 一覧行コンポーネント
const TodoLine = ({ key, todo, onEdit, onChangeComp }: propsTodoline) => {

  // todoの表示日付選択
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

  const isChecked = (data: number) => {
    return data > 0 ? true : false
  }

  return (
    <>
      <TableRow key={key}>
        <TableCell align="center">{todo.todoId}</TableCell>
        <TableCell align="left">{todo.todoText}</TableCell>
        <TableCell align="left">{viewDateConversion(todo)}</TableCell>
        <TableCell align="center">
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <Checkbox checked={isChecked(todo.compleateAt)} onChange={onChangeComp} />
        </TableCell>
      </TableRow>
    </>
  )
}