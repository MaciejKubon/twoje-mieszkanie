import Button from '../ui/Button';

const ObjectDetails = ({ data, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Ładowanie szczegółów...</div>;
  }

  if (!data) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Brak danych obiektu.</div>;
  }

  const getTypeLabel = (type) => {
    const types = {
      'apartment': 'Mieszkanie',
      'house': 'Dom',
      'room': 'Pokój'
    };
    return types[type] || type;
  };

  const DetailItem = ({ label, value }) => (
    <div className="detail-item">
      <div className="detail-item-label">{label}</div>
      <div className="detail-item-value">{value || '-'}</div>
    </div>
  );

  return (
    <div className="object-details">
      <div className="detail-header">
        <h2 className="detail-title">{data.name}</h2>
        <span className="status-badge primary">
          {getTypeLabel(data.type_of_building)}
        </span>
      </div>

      <div className="detail-grid">
        <DetailItem label="Kraj" value={data.country} />
        <DetailItem label="Województwo" value={data.voivodeship} />
        <DetailItem label="Miasto" value={data.city} />
        <DetailItem label="Kod pocztowy" value={data.zip_code} />
      </div>

      <DetailItem label="Ulica" value={data.street} />
      
      <div className="detail-grid">
        <DetailItem label="Numer budynku" value={data.house_number} />
        <DetailItem label="Numer lokalu" value={data.apartment_number} />
      </div>

      <div className="detail-actions">
        <Button variant="outline" onClick={onEdit}>
          Edytuj obiekt
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Usuń obiekt
        </Button>
      </div>
    </div>
  );
};

export default ObjectDetails;
