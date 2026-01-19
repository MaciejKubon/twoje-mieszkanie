import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = ({ onNavigateToRegister, showSnackbar }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        showSnackbar(data.message || 'Logowanie udane', 'success');
        // Start session / Redirect logic would go here
      } else {
        showSnackbar(data.message || data.error || 'Nieprawidłowe dane logowania', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showSnackbar('Wystąpił błąd połączenia.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-panel login-card">
        <div className="login-header">
          <h1 className="app-title">Twoje Mieszkanie</h1>
          <p className="login-subtitle">Witaj ponownie</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <Input 
            id="email" 
            type="email" 
            label="Adres Email" 
            placeholder="jan@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input 
            id="password" 
            type="password" 
            label="Hasło" 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <div className="form-options">
            <a href="#" className="forgot-password">Zapomniałeś hasła?</a>
          </div>

          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Logowanie...' : 'Zaloguj się'}
          </Button>

          <div className="divider">
            <span>lub</span>
          </div>

          <Button type="button" variant="outline" onClick={onNavigateToRegister}>
            Zarejestruj się
          </Button>
        </form>
      </div>
      
      {/* Decorative background elements if needed, though body has gradient */}
    </div>
  );
};

export default Login;
