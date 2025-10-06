import { useEffect, useState } from "react";
import { Login } from "./Login";
import { TodoParent } from "./TodoParent";
import { useAxiosStore } from "../util/AxiosStore";

export const MainMenu: React.FC = () => {

  // sessionStorage.setItem('authToken', token); // セット
  // sessionStorage.getItem('authToken'); // ゲット

  // メインメニューはログイン状態を管理
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const store = useAxiosStore();

  // ログイン状態
  const handleIsAuth = (isAuth: boolean) => {
    setIsAuth(isAuth);
  }

  return (
    <>
      {
        store.isAuth ?
          // ログイン済み
          <TodoParent handleLogout={() => handleIsAuth(false)}
          /> :
          // 未ログイン
          <Login isAuthSuccess={(isAuth) => handleIsAuth(isAuth)} />
      }
    </>
  );
}