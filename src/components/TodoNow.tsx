import { useCallback, useEffect, useState } from "react";
import { newTodo, type OperationComponentProps, type TodoItem } from "../util/TodoTypes";
import { Alert, Button, Checkbox, Grid, IconButton, Snackbar, TextField } from "@mui/material";
import { DialogEdit } from "./DialogEdit";
import { useAxiosStore } from "../util/AxiosStore";
import CreateIcon from '@mui/icons-material/Create';
import SendIcon from '@mui/icons-material/Send';
import { OperationNow, ListTodo } from "./ListTodo";
import { useAppStore } from "../util/AppStore";

/**
 * 現在のTodo画面
 * @returns JSX
 */
export const TodoNow: React.FC = () => {
  const [inputText, setInputText] = useState<string>(''); // テキスト入力値
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [isDisabledSendBtn, setIsDisabledSendBtn] = useState<boolean>(true);

  const [isOpne, setIsOpne] = useState<boolean>(false); // DialogEdit状態（開閉）
  const [editTodo, setEditTodo] = useState<TodoItem>(newTodo); // dialogEditの編集対象Todo
  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false); // アラート開閉

  const store = useAxiosStore();
  const appStore = useAppStore();

  // Todo更新
  const updateTodo = async (todo: TodoItem) => {
    console.log(`updateTodo todoid= ${todo.todoId}, todoText= ${todo.todoText}`)
    store.updateTodo({ todo });
  }

  // Todoを追加
  const addTodo = async (text: string) => {
    const todo = newTodo();
    todo.todoText = text

    store.addTodo({ todo });
  }

  // チェックONのTODOを完了済みにする
  // 画面のチェックON、完了ボタンで完了日を設定
  // 未完了TODOは完了日なし
  const sendComplete = () => {
    // todoListからisStates1===trueのtodoIdの配列を作成
    let todoIdList: number[] = []
    todoList.map(todo => {
      if (todo.isStatus1) {
        todoIdList.push(todo.todoId);
      }
    })
    // 完了対象が１つ以上ある場合API実行
    if (todoIdList.length > 0) {
      const req = {
        operation: 'set',
        todoIdList,
      }
      store.sendCompleteList(req);
    }
  }

  // useCallback
  const stableEditTodo = useCallback((editTodo: TodoItem) => {
    setIsOpne(true); // ダイアログオープン
    setEditTodo(editTodo); // ダイアログに編集Todoを連携
  }, [editTodo, isOpne])

  // TodoListのTodoを更新
  const stableChangeTodoComp = useCallback((changeTodo: TodoItem) => {
    let checkCount = 0;
    // todoListの内容を更新
    let workTodoList = todoList.map(item => {
      // Node.jsのライブラリでTodoのコピー
      const workTodo = structuredClone(item);
      if (workTodo.todoId === changeTodo.todoId) {
        // isStatusの内容を更新したitemを返却
        workTodo.isStatus1 = changeTodo.isStatus1
      }
      // isStatus1=trueをカウント
      if (workTodo.isStatus1) {
        checkCount++;
      }
      return workTodo;
    })
    // 送信ボタン状態、TodoList格納
    setIsDisabledSendBtn(checkCount === 0); // checkCountが0ならボタン非活性
    setTodoList(workTodoList);

  }, [isDisabledSendBtn, todoList])

  // 初回1回呼出し
  useEffect(() => {
    store.getList('now');
  }, [])

  // todoListの状態監視
  useEffect(() => {
    // 新しいTodoListを受信したとき
    if (store.stateTodoList === 'new') {
      setTodoList(store.todoList); // 格納
      store.initStateTodoList(); // 初期化
      setInputText(''); // Todo入力欄初期化

      appStore.openNotification('success', 'Todoを登録しました。');
      // appStore
      // appStore.setIsNotificationOpen(true); // アラート表示
    }

  }, [store.stateTodoList])

  return (
    <>
      <Grid container spacing={2} sx={{ margin: 3, maxWidth: 850 }}>
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
          <Button variant="contained" startIcon={<SendIcon />}
            sx={{ left: 12 }}
            disabled={isDisabledSendBtn}
            onClick={() => sendComplete()}
          >
            TODO完了
          </Button>
        </Grid>
        <Grid size={12}>
          <ListTodo
            todoList={todoList}
            operationComponent={OperationNow}
            operationCallback={(operation, todo) => {
              switch (operation) {
                case 'edit':
                  stableEditTodo(todo);
                  break;
                case 'checkbox':
                  stableChangeTodoComp(todo)
                  break;
              }
            }}
          />
        </Grid>
      </Grid >
      {/* 編集ダイアログ */}
      < DialogEdit
        todo={editTodo} isOpen={isOpne}
        onClose={() => {
          setEditTodo(newTodo);
          setIsOpne(false);
        }}
        onUpdate={(todo) => {
          updateTodo(todo);
          setIsOpne(false);
        }}
      />
      <Snackbar open={isOpenAlert} autoHideDuration={3000} onClose={() => setIsOpenAlert(false)}>
        <Alert severity="success">Todoを登録しました。</Alert>
      </Snackbar >
    </>
  );
}

