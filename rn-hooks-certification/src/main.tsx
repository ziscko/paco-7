import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/main.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/paco-7">
      <Routes>
        <Route path="/:slug" element={<App />} />
        <Route path="*" element={<Navigate to="/topic-1" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
