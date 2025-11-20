import { useCallback, useEffect, useState } from "react";
import { newTodo, type TodoItem } from "../util/TodoTypes";
import { Button, Grid, TextField } from "@mui/material";
import { DialogEdit } from "./DialogEdit";
import { useAxiosStore } from "../util/AxiosStore";
import CreateIcon from '@mui/icons-material/Create';
import SendIcon from '@mui/icons-material/Send';
import { OperationNow, ListTodo } from "./ListTodo";
import { useAppStore } from "../util/AppStore";
import { useConfirm } from "../util/CustomFook";

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

  const store = useAxiosStore();
  const appStore = useAppStore();

  // Todo更新
  const updateTodo = async (todo: TodoItem) => {
    console.log(`updateTodo todoid= ${todo.todoId}, todoText= ${todo.todoText}`)
    try {
      await store.updateTodo({ todo });
    } catch (error: any) {
      console.log('updateTodo エラー', error)
      if (error.status === 401) {
        // 認証エラーの場合はログアウト処理
        appStore.setIsStateTimeout(true);
      } else {
        // その他のエラー
        appStore.openNotification('error', error.errorMessage);
        store.setSuccessMessage(''); // メッセージクリア
      }
    }
  }

  // Todoを追加
  const addTodo = async (text: string) => {
    const todo = newTodo();
    todo.todoText = text

    try {
      await store.addTodo({ todo });
    } catch (error: any) {
      console.log('addTodo エラー', error)
      if (error.status === 401) {
        // 認証エラーの場合はログアウト処理
        appStore.setIsStateTimeout(true);
      } else {
        // その他のエラー
        appStore.openNotification('error', error.errorMessage);
        store.setSuccessMessage(''); // メッセージクリア
      }
    }
  }

  // チェックONのTODOを完了済みにする
  // 画面のチェックON、完了ボタンで完了日を設定
  // 未完了TODOは完了日なし
  const sendComplete = async () => {
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

      try {
        await store.sendCompleteList(req);
      } catch (error: any) {
        console.log('sendComplete エラー', error)
        if (error.status === 401) {
          // 認証エラーの場合はログアウト処理
          appStore.setIsStateTimeout(true);
        } else {
          // その他のエラー
          appStore.openNotification('error', error.errorMessage);
          store.setSuccessMessage(''); // メッセージクリア
        }
      }
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
    try {
      store.getList('now');
    } catch (error: any) {
      console.log('getList エラー', error)
      if (error.status === 401) {
        // 認証エラーの場合はログアウト処理
        appStore.setIsStateTimeout(true);
      } else {
        // その他のエラー
        appStore.openNotification('error', error.errorMessage);
        store.setSuccessMessage(''); // メッセージクリア
      }
    }
  }, [])

  // todoListの状態監視
  useEffect(() => {
    // 新しいTodoListを受信したとき
    if (store.stateTodoList === 'new') {
      setTodoList(store.todoList); // 格納
      store.initStateTodoList(); // 初期化
      setInputText(''); // Todo入力欄初期化
      console.log(`effect todoNow:  store.stateTodoList=${store.stateTodoList}  store.todoList.len= ${store.todoList.length}`)
    }

  }, [store.stateTodoList])

  // 通信成功時メッセージ（本来はID,textで作成が良い）
  useEffect(() => {
    if (store.successMessage.length > 0) {
      appStore.openNotification('success', store.successMessage);
      store.setSuccessMessage(''); // メッセージクリア
    }
  }, [store.successMessage])


  return (
    <>
      <Grid container spacing={2} sx={{ margin: 3, maxWidth: 850, height: '100hv' }}>
        <Grid size={12} sx={{ height: 50 }}>
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
        <Grid size={12} sx={{ flexGrow: 1 }}>
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
    </>
  );
}

