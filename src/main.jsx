import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/main.css';
import './styles/index.css'
import './styles/global.css'
import './styles/Auth.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
