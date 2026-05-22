import './index.css';
import './Styles/base.css';
import './Styles/layout.css';
import './Styles/components.css';
import './Styles/categorias.css';
import './Styles/dashboard.css';
import './Styles/gastos.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
