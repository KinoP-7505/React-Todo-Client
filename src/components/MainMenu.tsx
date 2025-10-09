import { Login } from "./Login";
import { TodoParent } from "./TodoParent";
import { useAxiosStore } from "../util/AxiosStore";
import { Grid } from "@mui/material";

export const MainMenu: React.FC = () => {

  // sessionStorage.setItem('authToken', token); // セット
  // sessionStorage.getItem('authToken'); // ゲット

  // ログイン状態はAxiosStoreで管理
  const store = useAxiosStore();

  return (
    <>
      <Grid container spacing={2} sx={{ margin: 3, maxWidth: 850 }}>
        <Grid size={6}>
          <h2>{store.getMenuTitle()}</h2>
        </Grid>
        <Grid size={6}>
          {
            store.isAuth ?
              <h4>{`ID：${store.userId}  ／  name：${store.viewUserName}`}</h4>
              : <></>
          }
        </Grid>
        <Grid size={12}>
          {
            store.isAuth ?
              // ログイン済み
              <TodoParent /> :
              // 未ログイン
              <Login />
          }
        </Grid>

      </Grid>

    </>
  );
}