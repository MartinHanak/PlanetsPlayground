import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/global.scss'
import App from './App';

import './i18n';

import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);