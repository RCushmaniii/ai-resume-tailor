import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initI18n } from '@/lib/i18n'

initI18n()

async function enableMocking() {
  // Check if MSW is explicitly enabled via environment variable
  const shouldEnableMocking = import.meta.env.VITE_ENABLE_MSW === 'true';
  
  // Skip MSW initialization if it's disabled
  if (!shouldEnableMocking) {
    console.info('API mocking is disabled (VITE_ENABLE_MSW=false).');
    return;
  }
  
  console.info('API mocking is enabled (development mode).');
  
  try {
    // Use the setupMsw helper to initialize MSW
    const { setupMsw } = await import('./lib/setupMsw');
    return await setupMsw();
  } catch (error) {
    console.error('Error starting MSW:', error);
    return false;
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})