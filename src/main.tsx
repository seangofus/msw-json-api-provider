import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if (import.meta.env.VITE_ENABLE_MSW === "true") {
  const module = await import("./mocks/browsers");
  const worker = module.worker;
  worker.start();
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
