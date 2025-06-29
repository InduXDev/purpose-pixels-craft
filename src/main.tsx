import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Redirect to /auth-error if error params are present in the hash
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
if (params.get('error_code') || params.get('error_description')) {
  window.location.replace('/auth-error' + window.location.hash);
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
