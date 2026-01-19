
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 이 줄이 빠지면 디자인이 깨집니다!

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
