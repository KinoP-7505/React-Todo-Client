import { Button, Grid, TextField } from "@mui/material"
import { useState } from "react"
import { useAxiosStore } from "../util/AxiosStore";
import { useAppStore } from "../util/AppStore";

export const Login: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const store = useAxiosStore();
  const appStore = useAppStore();

  // TODO: ログイン処理を実装
  // ログイン処理
  const handleLogin = async () => {
    console.log(`updateTodo todoid= ${userId}, todoText= ${pass}`)
    const req = {
      userName: userId,
      password: pass,
    }
    // ログイン処理：API呼び出し時、ログインチェックを行う
    try {
      // ログイン成功後、メインメニュー遷移
      await store.login(req);
    } catch (error: any) {
      console.log('handleLogin エラー', error)
      appStore.openNotification('error', error.errorMessage);
      store.setSuccessMessage(''); // メッセージクリア
    }
  }

  // 入力値を正規表現（半角英数字記号）チェック
  const checkInput = (value: string) => {
    const pattern = /^[!-~]*$/;
    return pattern.test(value);
  }

  return (
    <>
      <Grid container spacing={2} sx={{ margin: 3, maxWidth: 600 }}>
        <Grid size={12}>
          <TextField id="todo-input" label="ユーザーID" variant="standard"
            sx={{ width: 200 }}
            onChange={(e) => {
              // 半角英数字記号の場合、入力セット
              if (checkInput(e.target.value)) {
                setUserId(e.target.value);
              }
            }}
            value={userId} />
        </Grid>
        <Grid size={12}>
          <TextField id="todo-input" label="パスワード" variant="standard"
            sx={{ width: 200 }}
            onChange={(e) => {
              // 半角英数字記号の場合、入力セット
              if (checkInput(e.target.value)) {
                setPass(e.target.value);
              }
            }}
            value={pass} />

        </Grid>
        <Grid size={12}>
          <Button variant="contained"
            onClick={() => handleLogin()}
          >
            ログイン
          </Button>

        </Grid>

      </Grid>
    </>
  );
}