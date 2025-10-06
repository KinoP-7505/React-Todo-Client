import { Login } from "./Login";
import { TodoParent } from "./TodoParent";
import { useAxiosStore } from "../util/AxiosStore";

export const MainMenu: React.FC = () => {

  // sessionStorage.setItem('authToken', token); // セット
  // sessionStorage.getItem('authToken'); // ゲット

  // ログイン状態はAxiosStoreで管理
  const store = useAxiosStore();

  return (
    <>
      {
        store.isAuth ?
          // ログイン済み
          <TodoParent /> :
          // 未ログイン
          <Login />
      }
    </>
  );
}