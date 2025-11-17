import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Render the app with error handling
try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (error) {
  console.error('Failed to render app:', error)
  
  // Display fallback UI
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #d00;">Something went wrong</h1>
        <p>We're sorry, but the application failed to load. Please try refreshing the page.</p>
      </div>
    `
  }
}