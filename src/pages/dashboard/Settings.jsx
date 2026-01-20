import { useState } from 'react';
import ChangePasswordForm from '../../components/forms/ChangePasswordForm';

const Settings = ({ showSnackbar }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChangePassword = async (formData) => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${apiUrl}/api/changePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showSnackbar(data.message || 'Hasło zostało zmienione pomyślnie.', 'success');
        // Optionally clear form here or just leave it
      } else {
        if (data.error && typeof data.error === 'object') {
            setErrors(data.error);
            showSnackbar(data.message || 'Sprawdź formularz pod kątem błędów.', 'error');
        } else {
            showSnackbar(data.message || data.error || 'Błąd podczas zmiany hasła.', 'error');
        }
      }
    } catch (error) {
      console.error('Change password error:', error);
      showSnackbar('Błąd połączenia z serwerem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-header">Ustawienia</h1>
      
      <div className="settings-section" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Zmiana hasła</h2>
        <ChangePasswordForm 
          onSubmit={handleChangePassword} 
          isLoading={isLoading}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default Settings;
