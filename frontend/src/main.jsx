import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClientInstance = new QueryClient({
  defaultOptions : {
    queries : {
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={ queryClientInstance }>
    <App />
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
