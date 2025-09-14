import { useState } from "react";
import { EMPTY_TODO, type TodoItem } from "./TodoTypes";
import { TodoList } from "./TodoList";
import CreateIcon from '@mui/icons-material/Create';
import { Button, Grid, TextField } from "@mui/material";
import { DialogEdit } from "./DialogEdit";
import { utilDate } from "./util";

export const TodoParent: React.FC = () => {
  const [inputText, setInputText] = useState<string>(''); // テキスト入力値
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [index, setIndex] = useState<number>(0);
  const title = 'Todo一覧'

  const [isOpne, setIsOpne] = useState<boolean>(false); // DialogEdit状態（開閉）
  const [editTodo, setEditTodo] = useState<TodoItem>(EMPTY_TODO); // dialogEditの編集対象Todo

  // Todo更新
  const updateTodo = (todo: TodoItem) => {
    // 更新todoのidと一致する要素を入れ替えた配列を作成
    const updateTodolist = todoList.map(t => {
      // 更新Todoとidが一致する場合、更新Todoを配列に設定、それ以外は配列設定
      return (t.id === todo.id) ? todo : t;
    })
    // 作成した配列をセット
    setTodoList(updateTodolist);
  }

  // Todoを追加
  const addTodo = () => {
    const todo: TodoItem = {
      id: index + 1, // index+1を代入
      todo: inputText,
      createDate: utilDate.nowDate(),
      updateDate: "",
      completeDate: ""
    }
    setTodoList([...todoList, todo]); // リスト更新
    setIndex(todo.id) // index更新
  }

  // リストからidxに紐づくTodoを削除
  const deleteTodo = (todo: TodoItem) => {
    const delId = todo.id;
    const workList = todoList.filter(t => t.id !== delId)
    setTodoList(workList);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ margin: 3, maxWidth: 600 }}>
        <Grid size={12}>
          <h3>{title}</h3>
        </Grid>
        <Grid size={12}>
          <TextField id="todo-input" label="Todo入力" variant="standard"
            sx={{ width: 400 }}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            value={inputText} />
          <Button variant="contained" startIcon={<CreateIcon />}
            onClick={addTodo}
          >
            登録
          </Button>
        </Grid>
        <Grid size={12}>
          <TodoList todoList={todoList}
            onEditTodo={(todo) => {
              setIsOpne(true); // ダイアログオープン
              setEditTodo(todo); // ダイアログに編集Todoを連携
            }} />
        </Grid>
      </Grid>
      {/* 編集ダイアログ */}
      <DialogEdit
        todo={editTodo} isOpen={isOpne}
        onClose={() => {
          setEditTodo(EMPTY_TODO);
          setIsOpne(false);
        }}
        onUpdate={(text) => {
          updateTodo(text);
          setIsOpne(false);
        }}
        onDelete={(todo) => {
          deleteTodo(todo);
          setIsOpne(false);
        }
        }
      />
    </>
  );
}