import { Login } from "./Login";
import { TodoNow } from "./TodoNow";
import { useAxiosStore } from "../util/AxiosStore";
import { Button, Grid, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TodoComp } from "./TodoComp";
import { useAppStore } from "../util/AppStore";
import { ViewNotification } from "./ViewNotification";
import { DialogConfirm } from "./DialogConfirm";
import { useConfirm } from "../util/CustomFook";
export const MainMenu: React.FC = () => {
  // ログイン状態はAxiosStoreで管理
  const store = useAxiosStore();
  const appStore = useAppStore();
  const customComfirm = useConfirm();
  const customComfirm2 = useConfirm();

  const [nowAlignment, setNowAlignment] = useState<string>('now');

  // ログアウト処理
  const handleLogout = async (action?: number) => {
    if (action === 0) {
      // ダイアログを表示し、ユーザーの選択を待機（処理が中断される）
      const userConfirmed = await customComfirm.showConfirm('select', '選択', 'ログアウト（yes/no）');
      console.log('userConfirmed selecte:', userConfirmed);
      // Yes選択時処理
      if (userConfirmed) {
        store.logout();
      }
      return;
    }
    // それ以外は状態ログアウトダイアログ表示
    const userConfirmed2 = await customComfirm2.showConfirm('confirm', '確認', '認証切れのためログアウトします。');
    // コールバック後
    store.logout();
    appStore.setIsStateTimeout(false); // タイムアウトOFF

    console.log('userConfirmed confirm:', userConfirmed2);
  }

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

  useEffect(() => {
    // タイムアウトの場合、ログアウト処理
    if (appStore.isStateTimeout) {
      handleLogout();
    }
  }, [appStore.isStateTimeout])

  const gridHeight1 = 80;

  const TopRight = () => {
    return (
      <>
        <Typography variant="subtitle2" gutterBottom>{`ID：${store.userId}  ／  name：${store.viewUserName}`}</Typography>
        <Button variant="contained" sx={{ height: 30 }}
          onClick={() => handleLogout(0)}
        >
          ログアウト
        </Button>
      </>
    )
  }

  return (
    <>
      <Grid container spacing={0} sx={{ margin: 0, maxWidth: 850 }}>
        <Grid size={4} sx={{ height: gridHeight1 }}>
          <Typography variant="h4" gutterBottom>{store.getMenuTitle()}</Typography>
        </Grid>
        <Grid size={4} sx={{ height: gridHeight1 }} >
          {store.screenState > 0 && <ToggleBtnMenu />}
        </Grid>
        <Grid size={4} sx={{ height: gridHeight1 }}>
          {
            store.isAuth ?
              <TopRight />
              // <h4>{`ID：${store.userId}  ／  name：${store.viewUserName}`}</h4>
              : <></>
          }
        </Grid>
        <Grid size={12} sx={{ flexGrow: 1 }}>
          {store.screenState === 0 && <Login />}
          {store.screenState === 1 && <TodoNow />}
          {store.screenState === 2 && <TodoComp />}
        </Grid>
      </Grid>
      {/* 選択 */}
      <DialogConfirm
        isOpen={customComfirm.isDialogOpen}
        mode={customComfirm.dialogMode}
        title={customComfirm.dialogTitle}
        content={customComfirm.dialogMessage}
        onClose={() => customComfirm.handleConfirm(false)}
        onConfirm={(confirm: number) => {
          console.log(`DialogConfirm onConfirm confirm = ${confirm}`);
          // confirm=1の場合、Yes（true）
          customComfirm.handleConfirm(confirm === 1)
          // confirm === 1 ? customComfirm.handleConfirm() : customComfirm.handleClose()
        }}
      />
      {/* 確認 */}
      <DialogConfirm
        isOpen={customComfirm2.isDialogOpen}
        mode={customComfirm2.dialogMode}
        title={customComfirm2.dialogTitle}
        content={customComfirm2.dialogMessage}
        onClose={() => customComfirm2.handleConfirm(true)}
        onConfirm={(confirm: number) => {
          console.log(`DialogConfirm onConfirm confirm = ${confirm}`);
          // confirm=1の場合、Yes（true）
          customComfirm2.handleConfirm(true)
          // confirm === 1 ? customComfirm.handleConfirm() : customComfirm.handleClose()
        }}
      />

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

