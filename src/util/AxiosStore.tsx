import { create } from "zustand";
import type { TodoItem } from "./TodoTypes";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8080';
const url = {
  getList: '/getTodoList',
  addTodo: '/addTodo',
  updateTodo: '/updateTodo',
  updateCompleteAt: '/updateCompleteAt',
  deleteTodoEp: '/deleteTodoEp',
  login: '/login',
}

type AxiosState = {
  // login(req: { userName: string; password: string; }): unknown;
  isAuth: boolean; // 認証済み
  isLoading: boolean; // リクエスト中
  todoList: TodoItem[]; // 受信TodoList
  stateTodoList: string; // 状態：受信TodoList
  setIsLoading: (loading: boolean) => void; // ロード中
  setTodoList: (list: TodoItem[]) => void; // 受信TodoListを格納
  setNewTodoList: (list: TodoItem[]) => void;
  initStateTodoList: () => void; // 状態：受信TodoListを初期化
  setIsAuth: (auth: boolean) => void; // 認証状態を格納
  login: (req: any) => void;
  getList: () => void;
  addTodo: (req: any) => void; // axiosAPI todo追加
}

// tokenを付与したapiをインスタンス
const api = () => {
  // セッションストレージからtokenを取得
  const token = sessionStorage.getItem('authToken');
  // スペルミスがあった！！！
  // const auth = `Barer ${token}`;　正はBearer
  const auth = `Bearer ${token}`;
  console.log(auth)

  return axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json;charset=UTF-8',
    }
  })
}

export const useAxiosStore = create<AxiosState>()((set, get) => ({
  isAuth: false,
  isLoading: false,
  setIsLoading: (isLoading) => set(_state => ({ isLoading: isLoading })),
  todoList: [],
  stateTodoList: '',
  setTodoList: (list) => set(_state => ({ todoList: list })),
  // 受信todoListをセット、状態をNewに更新
  setNewTodoList: (list: TodoItem[]) => set(() => ({
    todoList: list,
    stateTodoList: 'new',
  })),
  // 状態を初期化
  initStateTodoList: () => set(() => ({ stateTodoList: '' })),
  setIsAuth: (auth) => set(_state => ({ isAuth: auth })),
  // ログイン
  login: async (req: any) => {
    // ロード中であれば処理しない
    if (get().isLoading) {
      return;
    }

    get().setIsLoading(true); // ロード中にセット
    let isAuth = false;
    try {
      await api().post(url.login, req).then(res => {
        if (res.data) {
          // セッションストレージにトークンをセット
          sessionStorage.setItem('authToken', res.data.jwtToken); // セット
          isAuth = true; // 認証成功
        } else {
          // 失敗したらトークン初期化
          sessionStorage.setItem('authToken', ''); // セット
        }
      })
    } catch (error) {
      // ネットワークエラー、4xx/5xx HTTPエラーなど、API呼び出しで例外が発生した場合
      console.error("ログインAPI呼び出し中にエラー:", error);
      sessionStorage.setItem('authToken', '');
    } finally {
      get().setIsLoading(false);
    }
    get().setIsAuth(isAuth);
  },
  // API getList
  getList: async () => {
    // ロード中であれば処理しない
    if (get().isLoading) {
      return;
    }
    get().setIsLoading(true); // ロード中にセット

    let list: TodoItem[] = [];
    try {
      await api().get(url.getList).then(res => {

        if (res.data && res.data.todoList) {
          console.log(res.data);
          console.log(res.data.todoList);
          // return res.data.todoList
          // 受信Todoリストを格納
          list = res.data.todoList;
        }
      })
    } finally {
      get().setIsLoading(false); // ロード中にセット
    }
    // 取得できなれければ、空の配列
    get().setNewTodoList(list);
  },
  // Todo追加
  addTodo: async (req) => {
    try {
      await api().post(url.addTodo, req).then(_res => {
        // 成功した場合、リストを更新
        get().getList();
      })
    } catch (e) {

    }
  },
}))

