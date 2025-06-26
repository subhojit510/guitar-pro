import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
const observerError = "ResizeObserver loop completed with undelivered notifications";
window.addEventListener("error", function (e) {
  if (e.message && e.message.includes(observerError)) {
    e.stopImmediatePropagation(); // prevent React dev overlay
  }
});