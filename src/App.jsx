import React from 'react';
import Routing from './routes/Routing';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import { useToast } from './contexts/ToastContext';

const AppContent = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <>
      <Routing />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;

