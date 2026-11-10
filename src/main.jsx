import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PWAInstallPrompt from './PWAInstallPrompt.jsx'
import { registerPWA } from './pwa.js'

registerPWA()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <App />
      <PWAInstallPrompt />
    </>
  </StrictMode>,
)
