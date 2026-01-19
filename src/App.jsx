import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [snackbar, setSnackbar] = useState({ 
    message: '', 
    type: '', 
    isVisible: false 
  });

  const showSnackbar = (message, type = 'success') => {
    setSnackbar({ message, type, isVisible: true });
  };

  useEffect(() => {
    if (snackbar.isVisible) {
      const timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, isVisible: false }));
      }, 3000); // Dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [snackbar.isVisible]);

  return (
    <>
      <div className={`snackbar ${snackbar.type} ${snackbar.isVisible ? 'show' : ''}`}>
        {snackbar.message}
      </div>

      {currentPage === 'login' ? (
        <Login 
          onNavigateToRegister={() => setCurrentPage('register')} 
          showSnackbar={showSnackbar}
        />
      ) : (
        <Register 
          onSwitchToLogin={() => setCurrentPage('login')} 
          showSnackbar={showSnackbar}
        />
      )}
    </>
  );
}

export default App
