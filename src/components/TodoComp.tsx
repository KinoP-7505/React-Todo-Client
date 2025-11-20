import { useCallback, useEffect, useState } from "react";
import type { TodoItem } from "../util/TodoTypes";
import { useAxiosStore } from "../util/AxiosStore";
import { Button, Grid } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { ListTodo, OperationComp } from "./ListTodo";
import { DialogConfirm } from "./DialogConfirm";
import { useConfirm } from "../util/CustomFook";

/**
 * 完了済みTodo画面
 * @returns JSX
 */
export const TodoComp: React.FC = () => {
  const store = useAxiosStore();
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [checkNum, setCheckNum] = useState<number>(0);

  // 完了Todoを未完了にする
  const sendInComplete = () => {
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
        operation: 'remove',
        todoIdList,
      }

      store.sendCompleteList(req);
    }
  }

  const customComfirm = useConfirm();

  const sendDelete = async (todo: TodoItem) => {
    console.log('--- 処理開始: Step 1 ---');

    // 🚀 Step 2: ダイアログを表示し、ユーザーの選択を待機（処理が中断される）
    const userConfirmed = await customComfirm.showConfirm('select', '選択', '削除確認（yes/no）');

    // 💡 Step 3: ユーザーの選択（true/false）に応じて処理を分岐
    if (userConfirmed) {
      console.log('Step 3: ✅ Yesが選択。削除処理を続行します。');
      // 削除処理実行
      store.deleteTodo({ todo });

    } else {
      console.log('Step 3: ❌ Noが選択。処理を中断。');
      return;
    }

    console.log('--- 処理完了: Step 4 ---');
  };

  // useCallback
  // TodoListのTodoを更新
  const stableChangeCheckBox = useCallback((changeTodo: TodoItem) => {
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
    setCheckNum(checkCount);
    setTodoList(workTodoList);
  }, [todoList])

  // 初回1回呼出し
  useEffect(() => {
    store.getList('comp');
  }, [])

  // todoListの状態監視
  useEffect(() => {
    // 新しいTodoListを受信したとき
    if (store.stateTodoList === 'new') {
      setTodoList(store.todoList); // 格納
      store.initStateTodoList(); // 初期化
    }
  }, [store.stateTodoList])


  // todoListの状態監視
  useEffect(() => {
    console.log('useEffect [store.stateTodoList]', todoList); // 👈 ここで確認
    // 新しいTodoListを受信したとき
    if (store.stateTodoList === 'new') {
      console.log('new onChangeTodoComp store.todoList:', store.todoList); // 👈 ここで確認

      setTodoList(store.todoList); // 格納
      store.initStateTodoList(); // 初期化
    }

  }, [store.stateTodoList])

  return (
    <>
      <Grid container spacing={2} sx={{ margin: 3, maxWidth: 850 }}>
        <Grid size={12}>
          <Button variant="contained" startIcon={<SendIcon />}
            disabled={checkNum === 0}
            onClick={() => {
              sendInComplete();
            }}
          >
            未完了
          </Button>
        </Grid>
        <Grid size={12}>
          <ListTodo
            todoList={todoList}
            operationComponent={OperationComp}
            operationCallback={(operation, todo) => {
              console.log(`operationCallback operation = ${operation}`)
              switch (operation) {
                case 'delete':
                  sendDelete(todo)
                  break;
                case 'checkbox':
                  stableChangeCheckBox(todo)
                  break;
              }
            }}
          />
        </Grid>
      </Grid>
      {/* 削除確認 */}
      <DialogConfirm
        isOpen={customComfirm.isDialogOpen}
        mode={customComfirm.dialogMode}
        title={customComfirm.dialogTitle}
        content={customComfirm.dialogMessage}
        onClose={() => customComfirm.handleConfirm(false)}
        onConfirm={(confirm: number) => {
          console.log(`DialogConfirm onConfirm confirm = ${confirm}`);
          // confirm=1の場合、Yes（true）
          customComfirm.handleConfirm(confirm === 1)
          // confirm === 1 ? customComfirm.handleConfirm() : customComfirm.handleClose()
        }}
      />
    </>
  );
}

