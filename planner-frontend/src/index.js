import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Optional: Global styles
import App from './App';  // Your main App component

// Mount the App component to the #root element in index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // The div where React will mount the app
);
