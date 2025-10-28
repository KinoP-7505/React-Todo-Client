import { Login } from "./Login";
import { TodoNow } from "./TodoNow";
import { useAxiosStore } from "../util/AxiosStore";
import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { TodoComp } from "./TodoComp";
import { useAppStore } from "../util/AppStore";
import { ViewNotification } from "./ViewNotification";
export const MainMenu: React.FC = () => {
  // ログイン状態はAxiosStoreで管理
  const store = useAxiosStore();
  const appStore = useAppStore();

  const [nowAlignment, setNowAlignment] = useState<string>('now');

  // ユーザログインチェック
  // ログイン後の有効期間が切れているかをチェックする

  useEffect(() => {
    // エラーメッセージがブランクではない場合（エラー発生時）
    if (store.errorMessage.length > 0) {
      appStore.openNotification('error', store.errorMessage);
      // メッセージクリア
      store.clearErrorMessage();
      setNowAlignment('now'); // ログイン初期画面設定
    }

  }, [store.errorMessage])


  // トグルボタン生成
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
      {/* 通知表示 */}
      <ViewNotification
        isOpen={appStore.isNotificationOpen}
        message={appStore.notificationMessage}
        mode={appStore.notificationMode}
        handleClose={() => appStore.setIsNotificationOpen(false)}
      />
    </>
  );
}

