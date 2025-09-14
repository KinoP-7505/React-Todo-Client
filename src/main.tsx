import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TodoParent } from './components/TodoParent.tsx'
import { Box } from '@mui/material'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Box
      sx={{
        position: 'fixed', // スクロールで固定
        top: 0,            // 上端から0の位置で固定
        left: 0,           // 画面の左端から0の位置
        width: '100%',
        height: '100%',
        bgcolor: 'white', // 背景色
        color: 'black',      // 文字色
        zIndex: 1000,
        p: 2,
      }}
    >
      <TodoParent />
    </Box>
  </StrictMode>,
)
