import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import axios from 'axios'
import { MainProvider } from './context/MainProvider.tsx'

// Marcamos la URL base para las solicitudes HTTP
axios.defaults.baseURL = 'http://localhost:3000'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </MainProvider>
  </StrictMode>,
)
