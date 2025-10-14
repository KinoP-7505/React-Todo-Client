import { Login } from "./Login";
import { TodoNow } from "./TodoNow";
import { useAxiosStore } from "../util/AxiosStore";
import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";

export const MainMenu: React.FC = () => {
  // ログイン状態はAxiosStoreで管理
  const store = useAxiosStore();

  return (
    <>
      <Grid container spacing={2} sx={{ margin: 3, maxWidth: 850 }}>
        <Grid size={4}>
          <h2>{store.getMenuTitle()}</h2>
        </Grid>
        <Grid size={4}>
          <ToggleButtonGroup
            color="primary"
            // value={alignment}
            exclusive
            // onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="web">現在</ToggleButton>
            <ToggleButton value="android">完了</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid size={4}>
          {
            store.isAuth ?
              <h4>{`ID：${store.userId}  ／  name：${store.viewUserName}`}</h4>
              : <></>
          }
        </Grid>
        <Grid size={12}>
          {store.screenState === 0 && <Login />}
          {store.screenState === 1 && <TodoNow />}
        </Grid>

      </Grid>

    </>
  );
}