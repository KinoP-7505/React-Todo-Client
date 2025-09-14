
// Todo型
export type TodoItem = {
  id: number;
  todo: string;
  createDate: string;
  updateDate: string;
  completeDate: string;
}

// TodoList画面Props
export type TodoListProps = {
  todoList: TodoItem[];
  onEditTodo: (editTodo: TodoItem) => void;
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
export const EMPTY_TODO: TodoItem = {
  id: 0,
  todo: "",
  createDate: "",
  updateDate: "",
  completeDate: ""
}