import { Login } from "./Login";
import { TodoNow } from "./TodoNow";
import { useAxiosStore } from "../util/AxiosStore";
import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { TodoComp } from "./TodoComp";
export const MainMenu: React.FC = () => {
  // ログイン状態はAxiosStoreで管理
  const store = useAxiosStore();
  const [nowAlignment, setNowAlignment] = useState<string>('now');

  const ToggleBtnMenu = () => {

    const handleChange = (alignment: any) => {
      console.log(`alignment: ${alignment}`)
      // 画面変更
      let screenId = 0;
      switch (alignment) {
        case 'now':
          screenId = 1;
          break
        case 'comp':
          screenId = 2;
          break
      }

      setNowAlignment(alignment);
      store.setScreenState(screenId)
    }

    return (
      <ToggleButtonGroup
        color="primary"
        sx={{ backgroundColor: "white" }}
        value={nowAlignment}
        exclusive={true} // 排他制御ON（必ず選択）
        onChange={(e, value) => {
          // 現在と違うボタンの場合、画面変更
          if (value !== null && value !== nowAlignment) {
            handleChange(value)
          }
        }}
        aria-label="Platform"
      >
        <ToggleButton value="now" sx={{ width: "80px" }}>現在</ToggleButton>
        <ToggleButton value="comp" sx={{ width: "80px" }}>完了</ToggleButton>
      </ToggleButtonGroup>
    )
  }

  return (
    <>
      <Grid container spacing={2} sx={{ margin: 3, maxWidth: 850 }}>
        <Grid size={4}>
          <h2>{store.getMenuTitle()}</h2>
        </Grid>
        <Grid size={4}>
          {store.screenState > 0 && <ToggleBtnMenu />}
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
          {store.screenState === 2 && <TodoComp />}
        </Grid>

      </Grid>

    </>
  );
}

