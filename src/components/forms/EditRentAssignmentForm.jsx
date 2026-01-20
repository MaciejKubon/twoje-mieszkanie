import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const EditRentAssignmentForm = ({ onSubmit, onCancel, isLoading, errors = {}, assignmentData }) => {
  const [formData, setFormData] = useState({
    rent_email: '',
    id_object: '',
    start_date: '',
    end_date: ''
  });
  const [objects, setObjects] = useState([]);
  const [objectsLoading, setObjectsLoading] = useState(true);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL;
        
        const response = await fetch(`${apiUrl}/api/object`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const objectsList = data.objects || (Array.isArray(data) ? data : (data.data || []));
          setObjects(objectsList);
        } else {
          console.error('Failed to fetch objects');
        }
      } catch (error) {
        console.error('Error fetching objects:', error);
      } finally {
        setObjectsLoading(false);
      }
    };

    fetchObjects();
  }, []);

  // Populate form with assignment data
  useEffect(() => {
    if (assignmentData) {
      // Format dates from ISO to YYYY-MM-DD for input fields
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
      };

      setFormData({
        rent_email: assignmentData.renter?.email || assignmentData.renter_email || '',
        id_object: assignmentData.id_object || '',
        start_date: formatDateForInput(assignmentData.start_date),
        end_date: formatDateForInput(assignmentData.end_date)
      });
    }
  }, [assignmentData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
        ...formData,
        id_object: Number(formData.id_object)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-object-form">
      <Input
        id="rent_email"
        label="Email najemcy"
        type="email"
        placeholder="np. najemca@example.com"
        value={formData.rent_email}
        onChange={handleChange}
        error={errors.rent_email}
        required
      />

      <div className="input-group">
        <label htmlFor="id_object" className="input-label">Wybierz obiekt</label>
        <div className="input-wrapper custom-select-wrapper">
          <select
            id="id_object"
            value={formData.id_object}
            onChange={handleChange}
            className="input-field"
            disabled={objectsLoading}
            required
          >
            {objectsLoading ? (
              <option value="">Ładowanie obiektów...</option>
            ) : objects.length > 0 ? (
                objects.map(obj => (
                    <option key={obj.id} value={obj.id}>
                        {obj.name} ({obj.city}, {obj.street})
                    </option>
                ))
            ) : (
                <option value="">Brak dostępnych obiektów</option>
            )}
          </select>
        </div>
        {errors.id_object && <span className="input-error-message">{errors.id_object}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input
          id="start_date"
          label="Data rozpoczęcia"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          error={errors.start_date}
          required
        />
        <Input
          id="end_date"
          label="Data zakończenia"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
          error={errors.end_date}
          required
        />
      </div>

      <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Anuluj
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading || objectsLoading}>
          {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </Button>
      </div>
    </form>
  );
};

export default EditRentAssignmentForm;
