import { Button, Grid, TextField } from "@mui/material"
import { useState } from "react"
import type { LoginProps } from "../util/TodoTypes";
import { useAxiosStore } from "../util/AxiosStore";

export const Login: React.FC<LoginProps> = ({ }) => {
  const title = 'ログイン画面'
  const [userId, setUserId] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const store = useAxiosStore();

  // TODO: ログイン処理を実装
  // ログイン処理
  const handleLogin = async () => {
    console.log(`updateTodo todoid= ${userId}, todoText= ${pass}`)
    const req = {
      userName: userId,
      password: pass,
    }
    // ログイン処理：API呼び出し時、ログインチェックを行う
    store.login(req);
  }

  return (
    <>
      <Grid container spacing={2} sx={{ margin: 3, maxWidth: 600 }}>
        <Grid size={12}>
          <h2>{title}</h2>
        </Grid>
        <Grid size={12}>
          <TextField id="todo-input" label="ユーザーID" variant="standard"
            sx={{ width: 200 }}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            value={userId} />
        </Grid>
        <Grid size={12}>
          <TextField id="todo-input" label="パスワード" variant="standard"
            sx={{ width: 200 }}
            onChange={(e) => {
              setPass(e.target.value);
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