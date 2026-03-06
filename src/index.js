import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const routerMode = (process.env.REACT_APP_ROUTER_MODE || 'browser').toLowerCase();
const RouterComponent = routerMode === 'hash' ? HashRouter : BrowserRouter;
const routerProps = routerMode === 'hash' ? {} : { basename: '/' };

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterComponent {...routerProps}>
      <App />
    </RouterComponent>
  </QueryClientProvider>
);
