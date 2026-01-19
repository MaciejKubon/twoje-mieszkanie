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
    <div className="detail-item" style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>{value || '-'}</div>
    </div>
  );

  return (
    <div className="object-details">
      <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{data.name}</h2>
        <span style={{ 
          display: 'inline-block', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '20px', 
          background: 'rgba(99, 102, 241, 0.2)', 
          color: 'var(--primary-color)',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          {getTypeLabel(data.type_of_building)}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <DetailItem label="Kraj" value={data.country} />
        <DetailItem label="Województwo" value={data.voivodeship} />
        <DetailItem label="Miasto" value={data.city} />
        <DetailItem label="Kod pocztowy" value={data.zip_code} />
      </div>

      <DetailItem label="Ulica" value={data.street} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <DetailItem label="Numer budynku" value={data.house_number} />
        <DetailItem label="Numer lokalu" value={data.apartment_number} />
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Button variant="outline" onClick={onEdit}>
          Edytuj obiekt
        </Button>
        <Button 
            variant="outline" 
            onClick={onDelete}
            style={{ 
                borderColor: 'rgba(239, 68, 68, 0.5)', 
                color: '#fca5a5' 
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
        >
          Usuń obiekt
        </Button>
      </div>
    </div>
  );
};

export default ObjectDetails;
