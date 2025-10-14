
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
  onEditTodo: (editTodo: TodoItem) => void;
  onChangeTodoComp: (editTodo: TodoItem) => void;
};

// 編集ダイアログProps
export type DialogEditProps = {
  todo: TodoItem;
  isOpen: boolean;
  onClose: () => void
  onUpdate: (todo: TodoItem) => void;
  onDelete: (todo: TodoItem) => void;
};

// 確認ダイアログProps
export type DialogConfirmProps = {
  isOpen: boolean;
  content: string;
  onClose: () => void
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