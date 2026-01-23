import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ChangePasswordForm = ({ onSubmit, isLoading, errors = {} }) => {
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    confirm_password: ''
  });
  
  const [inputErrors, setInputErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (inputErrors[id]) {
      setInputErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputErrors({});
    
    // Client-side validation
    if (formData.password !== formData.confirm_password) {
      setInputErrors({ 
        confirm_password: 'Hasła nie są identyczne',
        password: 'Hasła nie są identyczne'
      });
      return;
    }

    if (formData.password.length < 8) {
        setInputErrors({ 
            password: 'Hasło musi mieć co najmniej 8 znaków' 
        });
        return;
    }

    onSubmit(formData);
  };

  // Combine server errors with local errors
  const displayErrors = { ...errors, ...inputErrors };

  return (
    <form onSubmit={handleSubmit} className="change-password-form" style={{ maxWidth: '400px' }}>
      <Input
        id="current_password"
        type="password"
        label="Obecne hasło"
        placeholder="Wpisz obecne hasło"
        value={formData.current_password}
        onChange={handleChange}
        error={displayErrors.current_password}
        required
      />

      <Input
        id="password"
        type="password"
        label="Nowe hasło"
        placeholder="Wpisz nowe hasło"
        value={formData.password}
        onChange={handleChange}
        error={displayErrors.password}
        required
      />

      <Input
        id="confirm_password"
        type="password"
        label="Powtórz nowe hasło"
        placeholder="Powtórz nowe hasło"
        value={formData.confirm_password}
        onChange={handleChange}
        error={displayErrors.confirm_password}
        required
      />

      <div style={{ marginTop: '2rem' }}>
        <Button type="submit" variant="primary" disabled={isLoading} style={{ width: '100%' }}>
          {isLoading ? 'Zmienianie...' : 'Zmień hasło'}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
