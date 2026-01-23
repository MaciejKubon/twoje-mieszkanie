import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AddFullRentForm = ({ onSubmit, onCancel, isLoading, errors = {} }) => {
  const [formData, setFormData] = useState({
    id_rent_assignemt: '',
    amount: '',
    date: ''
  });
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL;
        
        const response = await fetch(`${apiUrl}/api/rentAssigment`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const list = data.data || [];
          setAssignments(list);
        } else {
          console.error('Failed to fetch rent assignments');
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setAssignmentsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
        amount: Number(formData.amount),
        id_rent_assigment: Number(formData.id_rent_assignemt),
        date: formData.date
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="add-object-form">
      <div className="input-group">
        <label htmlFor="id_rent_assignemt" className="input-label">Umowa Najmu</label>
        <div className="input-wrapper custom-select-wrapper">
          <select
            id="id_rent_assignemt"
            value={formData.id_rent_assignemt}
            onChange={handleChange}
            className="input-field"
            disabled={assignmentsLoading}
            required
          >
            <option value="" disabled>Wybierz umowę...</option>
            {assignmentsLoading ? (
              <option value="" disabled>Ładowanie umów...</option>
            ) : assignments.length > 0 ? (
                assignments.map(a => (
                    <option key={a.id} value={a.id}>
                        {a.object_name} - {a.renter_first_name} {a.renter_last_name}
                    </option>
                ))
            ) : (
                <option value="">Brak dostępnych umów</option>
            )}
          </select>
        </div>
        {errors.id_rent_assignemt && <span className="input-error-message">{errors.id_rent_assignemt}</span>}
      </div>

      <Input
        id="amount"
        label="Kwota"
        type="number"
        step="0.01"
        placeholder="np. 2500.00"
        value={formData.amount}
        onChange={handleChange}
        error={errors.amount}
        required
      />

      <Input
          id="date"
          label="Termin płatności"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
      />
      <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Anuluj
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading || assignmentsLoading}>
          {isLoading ? 'Dodawanie...' : 'Dodaj czynsz'}
        </Button>
      </div>
    </form>
  );
};

export default AddFullRentForm;
