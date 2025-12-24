import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initI18n } from '@/lib/i18n'

initI18n()

async function enableMocking() {
  // Only enable MSW in development mode
  const shouldEnableMocking = import.meta.env.DEV;
  
  // Skip MSW initialization if it's disabled (production)
  if (!shouldEnableMocking) {
    console.info('API mocking is disabled (production mode).');
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