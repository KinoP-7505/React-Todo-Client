import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { TodoItem, TodoListProps } from "./TodoTypes";
import EditIcon from '@mui/icons-material/Edit';

// Todo一覧コンポーネント
export const TodoList: React.FC<TodoListProps> = ({
  todoList, onEditTodo
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
}

// 一覧行コンポーネント
const TodoLine = ({ key, todo, onEdit }: propsTodoline) => {

  // todoの表示日付選択
  const viewDateConversion = (item: TodoItem) => {
    // 完了日が有る場合、表示日付＝完了日
    if (item.completeDate) {
      return item.completeDate
    } else if (item.updateDate) {
      // 更新日が有る場合、表示日付＝更新日
      return item.updateDate
    }
    // 表示日付＝作成日
    return item.createDate
  }

  return (
    <>
      <TableRow key={key}>
        <TableCell align="center">{todo.id}</TableCell>
        <TableCell align="left">{todo.todo}</TableCell>
        <TableCell align="left">{viewDateConversion(todo)}</TableCell>
        <TableCell align="center">
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}