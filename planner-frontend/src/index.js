import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Optional: Global styles
import App from './App';  // Your main App component
import 'bootstrap/dist/css/bootstrap.min.css';

// React 18's createRoot method should only be used once to mount the root app
const root = ReactDOM.createRoot(document.getElementById('root')); // Get the root div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
