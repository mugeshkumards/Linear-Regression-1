import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LinearRegression from './LinearRegression.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LinearRegression />
  </StrictMode>,
)
