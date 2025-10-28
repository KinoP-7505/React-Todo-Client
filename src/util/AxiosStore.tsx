import { create } from "zustand";
import type { TodoItem } from "./TodoTypes";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8080';
const url = {
  getList: '/getTodoList',
  getListComp: '/getTodoListComp',
  addTodo: '/addTodo',
  updateTodo: '/updateTodo',
  sendCompleteList: '/sendCompleteList',
  deleteTodo: '/deleteTodo',
  login: '/login',
}

// 画面ID
export const screenId = {
  login: 0,
  todoNow: 1,
  todoComp: 2,
}

// Storeのインターフェース
type AxiosState = {
  isAuth: boolean; // 認証済み
  screenState: number; // 画面
  setScreenState: (screenId: number) => void;
  clearErrorMessage: () => void;
  setLogoutState: (errorMessage: string) => void; // ログアウト状態セット
  isLoading: boolean; // リクエスト中
  successMessage: string; // 成功メッセージ
  setSuccessMessage: (message: string) => void; // 成功メッセージセッター
  errorMessage: string; // エラーメッセージ
  todoList: TodoItem[]; // 受信TodoList
  stateTodoList: string; // 状態：受信TodoList
  userId: number; // ユーザId
  viewUserName: string; // 表示ユーザ名
  setUserId: (id: number) => void; // ユーザ情報の格納
  setViewUserName: (name: string) => void; // ユーザ情報の格納
  getMenuTitle: () => string; // メニュータイトルの取得
  setIsLoading: (loading: boolean) => void; // ロード中
  setTodoList: (list: TodoItem[]) => void; // 受信TodoListを格納
  setNewTodoList: (list: TodoItem[]) => void;
  initStateTodoList: () => void; // 状態：受信TodoListを初期化
  setIsAuth: (auth: boolean) => void; // 認証状態を格納
  login: (req: any) => void;
  getList: (operation: string) => void;
  // getListComp: () => void;
  addTodo: (req: any) => void; // axiosAPI todo追加
  updateTodo: (req: any) => void; // axiosAPI todo更新
  sendCompleteList: (req: any) => void; // axiosAPI 完了todo送信
  deleteTodo: (req: any) => void; // axiosAPI todo削除
}

// tokenを付与したapiをインスタンス
const api = () => {
  // const axiosStore = useAxiosStore();
  // const appStore = useAppStore();
  // セッションストレージからtokenを取得
  const token = sessionStorage.getItem('authToken');
  // スペルミスがあった！！！
  // const auth = `Barer ${token}`;　正はBearer
  const auth = `Bearer ${token}`;
  console.log(auth)

  // Axiosクリエイト
  const instanceAxios = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json;charset=UTF-8',
    }
  })

  // インターセプターの設定（共通エラー処理）
  instanceAxios.interceptors.response.use(
    // 成功時(2xx) responseを返す
    (response) => {
      return response;
    },
    // エラー時（2xxステータス以外）
    (error) => {
      const { response } = error;
      let errorMessage = ''; // 

      // responseが有る場合
      if (response) {
        switch (response.status) {
          case 401: // 認証エラー
            errorMessage = `${response.status}:認証エラー: トークンの期限切れ、または、無効な認証情報です。`;
            break;
          case 403: // 権限エラー
            errorMessage = `${response.status}:権限エラー: アクセス権限がありません。`;
            break;
          case 500: // サーバーエラー
            errorMessage = `${response.status}:サーバーエラー: 予期せぬエラーが発生しました。`;
            break;
          default:
            errorMessage = `${response.status}:HTTPエラー ${response.status}: ${response.data.message || '不明なエラー'}`;
        }

      } else if (error.request) {
        // リクエストが有る場合
        errorMessage = `${response.status}:ネットワークエラー : サーバから応答なし'}`;
      } else {
        // リクエスト設定エラー
        errorMessage = `${response.status}:リクエスト設定エラー : ${error.message}'}`;
      }

      console.error(errorMessage);
      logoutAction(errorMessage); // 状態をログアウトに設定

      // 呼び出し元のTry-Catchでエラーを補足する
      return Promise.reject({ error, errorMessage });
    },
  )

  // カスタムAxios返却
  return instanceAxios;
}

// Axios通信系のStore
export const useAxiosStore = create<AxiosState>()((set, get) => ({
  isAuth: false,
  screenState: 0,
  isLoading: false,
  successMessage: '',
  setSuccessMessage: (message: string) => set(() => ({ successMessage: message })),
  errorMessage: '',
  setIsLoading: (isLoading) => set(_state => ({ isLoading: isLoading })),
  // メニュータイトル
  getMenuTitle: () => {
    if (get().isAuth) {
      return 'Todo一覧';
    }
    // 未ログイン時
    return 'ログイン画面';
  },
  todoList: [],
  stateTodoList: '',
  setTodoList: (list) => set(() => ({ todoList: list })),
  // 受信todoListをセット、状態をNewに更新
  setNewTodoList: (list: TodoItem[]) => set(() => ({
    todoList: list,
    stateTodoList: 'new',
  })),
  // ユーザ情報 登録
  viewUserName: '',
  userId: screenId.login, // 初期値はLogin画面
  setUserId: (id) => set(() => ({ userId: id })),
  setViewUserName: (name) => set(() => ({ viewUserName: name })),
  // 状態を初期化
  initStateTodoList: () => set(() => ({ stateTodoList: '' })),
  setIsAuth: (auth) => set(() => ({ isAuth: auth })),
  setScreenState: (screen: number) => set(() => ({ screenState: screen })),
  clearErrorMessage: () => set(() => ({ errorMessage: '' })),
  setLogoutState: (errorMessage: string) => set(() => ({
    // // エラー発生時は未ログイン状態にパラメータを設定、ログイン画面に遷移する
    isAuth: false, // 認証なし状態
    screenState: 0, // ログイン画面遷移
    errorMessage, // エラーメッセージ設定
  })),

  // ログイン
  login: async (req: any) => {
    // ロード中であれば処理しない
    if (get().isLoading) {
      return;
    }

    get().setIsLoading(true); // ロード中にセット
    let isAuth = false;
    let userId = 0;
    let viewUserName = '';
    try {
      await api().post(url.login, req).then(res => {
        if (res.data) {
          // sessionStorage.setItem('authToken', token); // セット
          // sessionStorage.getItem('authToken'); // ゲット
          // セッションストレージにトークンをセット
          sessionStorage.setItem('authToken', res.data.jwtToken); // セット
          isAuth = true; // 認証成功
          userId = res.data.userId;
          viewUserName = res.data.userViewName;
        } else {
          // 失敗したらトークン初期化
          sessionStorage.setItem('authToken', ''); // セット
        }
      })
    } catch (error) {
      // ネットワークエラー、4xx/5xx HTTPエラーなど、API呼び出しで例外が発生した場合
      sessionStorage.setItem('authToken', '');
    } finally {
      // 状態のセット
      get().setIsLoading(false);
      get().setIsAuth(isAuth);
      get().setScreenState(screenId.todoNow);
      get().setUserId(userId);
      get().setViewUserName(viewUserName);
    }
  },
  // API getList
  getList: async (operation: string) => {
    // ロード中であれば処理しない
    if (get().isLoading) {
      return;
    }
    get().setIsLoading(true); // ロード中にセット

    let endpoint = '';
    switch (operation) {
      case 'now':
        endpoint = url.getList
        break;
      case 'comp':
        endpoint = url.getListComp
        break;
    }

    let list: TodoItem[] = [];
    try {
      await api().get(endpoint).then(res => {
        if (res.data && res.data.todoList) {
          // 受信Todoリストを格納、React管理用プロパティを初期化
          list = res.data.todoList.map((item: TodoItem) => {
            return {
              ...item,
              isStatus1: false, // 状態管理1
            }
          });
        }
      })
    } catch (error) {
      // エラー発生
    } finally {
      get().setIsLoading(false); // 通常にセット
    }
    // 取得できなれければ、空の配列
    get().setNewTodoList(list);
  },

  // Todo追加
  addTodo: async (req) => {
    try {
      await api().post(url.addTodo, req).then(_res => {
        // （Promiseチェーン：成功した場合、リストを更新）
        get().setSuccessMessage('Todoを登録しました。');
        return get().getList('now');
      })
    } catch (e) {
      // エラー処理
    }
  },
  // Todo更新
  updateTodo: async (req) => {
    try {
      await api().post(url.updateTodo, req).then(_res => {
        // （Promiseチェーン：成功した場合、リストを更新）
        return get().getList('now');
      })
    } catch (e) {
      // エラー処理
    }
  },
  // Todo完了
  sendCompleteList: async (req) => {

    try {
      await api().post(url.sendCompleteList, req).then(_res => {
        // 画面とサーバの同期は取れている想定であるが、念のため更新
        // （Promiseチェーン：成功した場合、リストを更新）
        if (req.operation === 'set') {
          return get().getList('now');
        } else if (req.operation === 'remove') {
          return get().getList('comp');
        }
      })
    } catch (e) {
      // エラー処理
    }
  },
  // Todo削除（完了画面での削除）
  deleteTodo: async (req) => {
    try {
      await api().post(url.deleteTodo, req).then(_res => {
        // （Promiseチェーン：成功した場合、リストを更新）
        return get().getList('comp');
      })
    } catch (e) {
      // エラー処理
    }
  },

}))

// ログアウト状態
export const logoutAction = (errorMessage: string) => {
  useAxiosStore.getState().setLogoutState(errorMessage);
}

