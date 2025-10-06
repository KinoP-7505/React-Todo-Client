import { useEffect, useState } from "react";
import { newTodo, type TodoItem, type TodoParentProps } from "../util/TodoTypes";
import { TodoList } from "./TodoList";
import CreateIcon from '@mui/icons-material/Create';
import { Button, Grid, TextField } from "@mui/material";
import { DialogEdit } from "./DialogEdit";
import { useAxiosStore } from "../util/AxiosStore";

export const TodoParent: React.FC<TodoParentProps> = ({ }) => {
  const [inputText, setInputText] = useState<string>(''); // テキスト入力値
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  // const [index, setIndex] = useState<number>(0);
  const title = 'Todo一覧'

  const [isOpne, setIsOpne] = useState<boolean>(false); // DialogEdit状態（開閉）
  const [editTodo, setEditTodo] = useState<TodoItem>(newTodo); // dialogEditの編集対象Todo
  const [response, setResponse] = useState<any>();

  const store = useAxiosStore();

  // Todo更新
  const updateTodo = async (todo: TodoItem) => {
    // ログイン中の場合呼出し
    // if (isLogin) {
    // reqを省略
    console.log(`updateTodo todoid= ${todo.todoId}, todoText= ${todo.todoText}`)
    // await axiosUtil.api.post(axiosUtil.updateTodo, { todo }).then(
    //   res => setResponse(res.data)
    // )
    // }
  }

  // Todoを追加
  const addTodo = async (text: string) => {
    const todo = newTodo();
    todo.todoText = text

    // req {todo: todo}
    store.addTodo({ todo });
  }

  // 完了を更新
  const updateCompleteAt = async (todo: TodoItem) => {
    // if (isLogin) {
    //   // reqを省略
    //   console.log(`updateCompleteAt todoid= ${todo.todoId}`)
    // await axiosUtil.api.post(axiosUtil.updateCompleteAt, { todo: todo }).then(
    //   res => setResponse(res.data)
    // )
    // }
  }

  // リストからidxに紐づくTodoを削除
  const deleteTodo = (todo: TodoItem) => {
    const delId = todo.todoId;
    const workList = todoList.filter(t => t.todoId !== delId)
    setTodoList(workList);
  };

  // 初回1回呼出し
  useEffect(() => {
    store.getList();
  }, [])

  // todoListの状態監視
  useEffect(() => {
    // 新しいTodoListを受信したとき
    if (store.stateTodoList === 'new') {
      setTodoList(store.todoList); // 格納
      store.initStateTodoList(); // 初期化
    }

  }, [store.stateTodoList])

  useEffect(() => {
    if (response !== '') {
      if (response === 'delete') {
        alert(`Todoを削除`);
      }
      store.getList();
    }
  }, [response])

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
            onClick={() => addTodo(inputText)}
          >
            登録
          </Button>
        </Grid>
        <Grid size={12}>
          <TodoList todoList={todoList}
            onEditTodo={(todo) => {
              setIsOpne(true); // ダイアログオープン
              setEditTodo(todo); // ダイアログに編集Todoを連携
            }}
            onChangeTodoComp={(todo) => updateCompleteAt(todo)} // 完了を更新 
          />
        </Grid>
      </Grid>
      {/* 編集ダイアログ */}
      <DialogEdit
        todo={editTodo} isOpen={isOpne}
        onClose={() => {
          setEditTodo(newTodo);
          setIsOpne(false);
        }}
        onUpdate={(todo) => {
          updateTodo(todo);
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