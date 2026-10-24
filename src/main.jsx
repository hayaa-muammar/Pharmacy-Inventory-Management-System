import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { InventoryProvider } from './context/InventoryContext';

// Import base design system stylesheet and React UI enhancements
import '../style.css';
import './styles/react-enhancements.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </React.StrictMode>
  );
}
