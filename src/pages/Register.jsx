import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = ({ onSwitchToLogin, showSnackbar }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'owner'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error for this field when typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: 'Hasła nie są identyczne.' });
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar(data.message || 'Rejestracja powiodła się. Możesz się zalogować.', 'success');
        if (onSwitchToLogin) {
            onSwitchToLogin();
        }
      } else {
        // Handle validation errors specifically
        if (data.error && typeof data.error === 'object') {
            setErrors(data.error);
            showSnackbar(data.message || 'Sprawdź formularz pod kątem błędów.', 'error');
        } else {
            showSnackbar(data.message || data.error || 'Błąd rejestracji.', 'error');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      showSnackbar('Wystąpił błąd połączenia.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-panel login-card" style={{ maxWidth: '500px' }}>
        <div className="login-header">
          <h1 className="app-title">Twoje Mieszkanie</h1>
          <p className="login-subtitle">Utwórz nowe konto</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input 
              id="first_name" 
              type="text" 
              label="Imię" 
              placeholder="Jan"
              value={formData.first_name}
              onChange={handleChange}
              error={errors.first_name}
              required
            />
            <Input 
              id="last_name" 
              type="text" 
              label="Nazwisko" 
              placeholder="Kowalski"
              value={formData.last_name}
              onChange={handleChange}
              error={errors.last_name}
              required
            />
          </div>

          <Input 
            id="email" 
            type="email" 
            label="Adres Email" 
            placeholder="jan@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          <div className="input-group">
            <label htmlFor="role" className="input-label">Rola</label>
            <div className="input-wrapper">
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                <option value="owner">Właściciel</option>
                <option value="rentier">Najemca</option>
              </select>
            </div>
          </div>

          <Input 
            id="password" 
            type="password" 
            label="Hasło" 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            minLength={8}
          />

          <Input 
            id="confirm_password" 
            type="password" 
            label="Potwierdź hasło" 
            placeholder="••••••••"
            value={formData.confirm_password}
            onChange={handleChange}
            error={errors.confirm_password}
            required
            minLength={8}
          />
          
          <Button type="submit" variant="primary" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
          </Button>

          <div className="divider">
            <span>Masz już konto?</span>
          </div>

          <Button type="button" variant="outline" onClick={onSwitchToLogin}>
            Zaloguj się
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
