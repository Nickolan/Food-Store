import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import axios from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainProvider } from './context/MainProvider'

// Marcamos la URL base para las solicitudes HTTP
axios.defaults.baseURL = 'http://localhost:8000'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MainProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MainProvider>
    </QueryClientProvider>
  </StrictMode>,
)
