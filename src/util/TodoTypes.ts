
// Todo型
export type TodoItem = {
  todoId: number;
  todoText: string;
  userId: number;
  isStatus1: boolean; // 状態管理1
  createdAt: number;
  updatedAt: number;
  compleateAt: number;
}

// TodoList画面Props
export type TodoListProps = {
  todoList: TodoItem[];
  operationComponent: any; // 操作欄のコンポーネント
  // operation:操作、data:コールバックデータ
  operationCallback: (operation: string, data: TodoItem) => void; // 汎用コールバック
};

export type OperationComponentProps = {
  todo: TodoItem,
  // operation:操作、data:コールバックデータ
  operationCallback: (operation: string, data: TodoItem) => void; // 汎用コールバック
}


// TodoList画面Props
export type TodoListNowProps = {
  todoList: TodoItem[];
  onEditTodo: (editTodo: TodoItem) => void;
  onChangeCheck1: (editTodo: TodoItem) => void;
};

// TodoList完了画面Props
export type TodoListCompProps = {
  todoList: TodoItem[];
  onChangeCheck1: (editTodo: TodoItem) => void;
};

// 編集ダイアログProps
export type DialogEditProps = {
  todo: TodoItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (todo: TodoItem) => void;
  // onDelete: (todo: TodoItem) => void;
};

// 確認ダイアログProps
export type DialogConfirmProps = {
  isOpen: boolean;
  mode: string;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: (confirm: number) => void; // 回答を返す
}


// 空のTodoItem
export const newTodo = () => {
  const todo: TodoItem = {
    todoId: 0,
    todoText: '',
    userId: 0,
    isStatus1: false,
    createdAt: 0,
    updatedAt: 0,
    compleateAt: 0
  }
  return todo;
}