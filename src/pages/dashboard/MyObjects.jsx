import { useState } from 'react';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import AddObjectForm from '../../components/forms/AddObjectForm';

const MyObjects = ({ showSnackbar }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddObject = async (formData) => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${apiUrl}/api/object`, {
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
        showSnackbar(data.message || 'Obiekt został dodany pomyślnie.', 'success');
        setIsDrawerOpen(false);
        // Here we would effectively refresh the list
      } else {
        if (data.error && typeof data.error === 'object') {
            setErrors(data.error);
            showSnackbar(data.message || 'Sprawdź formularz pod kątem błędów.', 'error');
        } else {
            showSnackbar(data.message || data.error || 'Błąd podczas dodawania obiektu.', 'error');
        }
      }
    } catch (error) {
      console.error('Add object error:', error);
      showSnackbar('Błąd połączenia z serwerem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-header" style={{ marginBottom: 0 }}>Moje Obiekty</h1>
        <div style={{ width: '200px' }}>
          <Button onClick={() => {
            setErrors({});
            setIsDrawerOpen(true);
          }}>
            + Dodaj obiekt
          </Button>
        </div>
      </div>
      
      <p className="page-text">Tutaj pojawi się lista Twoich nieruchomości.</p>
      
      {/* List will go here */}

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Dodaj nowy obiekt"
      >
        <AddObjectForm 
          onSubmit={handleAddObject} 
          onCancel={() => setIsDrawerOpen(false)} 
          isLoading={isLoading}
          errors={errors}
        />
      </Drawer>
    </div>
  );
};

export default MyObjects;
