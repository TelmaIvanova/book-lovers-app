import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastProvider } from './components/ToastProvider';
import { SocketProvider } from './context/SocketContext';
import { EthereumProvider } from './context/EthereumContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <SocketProvider>
            <EthereumProvider>
              <App />
            </EthereumProvider>
          </SocketProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
