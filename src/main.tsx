import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import './index.css';

// Global error handler for uncaught promises
window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
};

// Global error handler for runtime errors
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Runtime error:', { message, source, lineno, colno, error });
  return false;
};

// Find the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);