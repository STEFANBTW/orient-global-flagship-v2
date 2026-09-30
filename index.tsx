
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RoleProvider } from './src/context/role-context';
import { CMSProvider } from './src/context/cms-context';
import { NotificationProvider } from './src/context/NotificationContext';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RoleProvider>
      <CMSProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </CMSProvider>
    </RoleProvider>
  </React.StrictMode>
);
