/**
 * index.js — React entry point.
 *
 * This file is the very first JavaScript that runs.
 * It imports the App component and renders it into the <div id="root">
 * element in public/index.html.
 *
 * React.StrictMode wraps the app to help catch bugs during development
 * (it renders components twice to detect side effects — only in dev mode).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';  // Global styles applied to entire app

// createRoot is React 18's way to initialize the app
// (replaces the older ReactDOM.render() method)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
