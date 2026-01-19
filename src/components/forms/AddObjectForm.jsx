import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AddObjectForm = ({ onSubmit, onCancel, isLoading, errors = {}, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    type_of_building: 'apartment',
    country: '',
    voivodeship: '',
    city: '',
    zip_code: '',
    street: '',
    house_number: '',
    apartment_number: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type_of_building: initialData.type_of_building || 'apartment',
        country: initialData.country || '',
        voivodeship: initialData.voivodeship || '',
        city: initialData.city || '',
        zip_code: initialData.zip_code || '',
        street: initialData.street || '',
        house_number: String(initialData.house_number || ''),
        apartment_number: String(initialData.apartment_number || '')
      });
    } else {
       setFormData({
        name: '',
        type_of_building: 'apartment',
        country: '',
        voivodeship: '',
        city: '',
        zip_code: '',
        street: '',
        house_number: '',
        apartment_number: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      house_number: String(formData.house_number),
      apartment_number: String(formData.apartment_number || '')
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="add-object-form">
      <Input
        id="name"
        label="Nazwa obiektu"
        placeholder="np. Apartament Centrum"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <div className="input-group">
        <label htmlFor="type_of_building" className="input-label">Typ budynku</label>
        <div className="input-wrapper custom-select-wrapper">
          <select
            id="type_of_building"
            value={formData.type_of_building}
            onChange={handleChange}
            className="input-field"
          >
            <option value="apartment">Mieszkanie</option>
            <option value="house">Dom</option>
            <option value="room">Pokój</option>
          </select>
        </div>
      </div>

      <Input
        id="country"
        label="Kraj"
        placeholder="np. Polska"
        value={formData.country}
        onChange={handleChange}
        error={errors.country}
        required
      />

      <Input
        id="voivodeship"
        label="Województwo"
        placeholder="np. Mazowieckie"
        value={formData.voivodeship}
        onChange={handleChange}
        error={errors.voivodeship}
        required
      />

      <Input
        id="city"
        label="Miasto"
        placeholder="np. Warszawa"
        value={formData.city}
        onChange={handleChange}
        error={errors.city}
        required
      />

      <Input
        id="zip_code"
        label="Kod pocztowy"
        placeholder="np. 00-001"
        value={formData.zip_code}
        onChange={handleChange}
        error={errors.zip_code}
        required
      />

      <Input
        id="street"
        label="Ulica"
        placeholder="np. Marszałkowska"
        value={formData.street}
        onChange={handleChange}
        error={errors.street}
        required
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input
          id="house_number"
          label="Nr budynku"
          placeholder="np. 10A"
          value={formData.house_number}
          onChange={handleChange}
          error={errors.house_number}
          required
        />
        <Input
          id="apartment_number"
          label="Nr lokalu"
          placeholder="np. 5"
          value={formData.apartment_number}
          onChange={handleChange}
          error={errors.apartment_number}
        />
      </div>

      <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Anuluj
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? (initialData ? 'Zapisywanie...' : 'Dodawanie...') : (initialData ? 'Zapisz zmiany' : 'Dodaj obiekt')}
        </Button>
      </div>
    </form>
  );
};

export default AddObjectForm;
