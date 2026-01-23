import Button from '../ui/Button';

const FullRentDetails = ({ data, isLoading, onEdit, onDelete, onNavigate, onAccept, onConfirmPaid }) => {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Ładowanie szczegółów...</div>;
  }

  if (!data) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Brak danych czynszu.</div>;
  }

  const userRole = localStorage.getItem('role');

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  const DetailItem = ({ label, value, onClick }) => (
    <div className="detail-item">
      <div className="detail-item-label">{label}</div>
      <div 
        className="detail-item-value" 
        style={onClick ? { cursor: 'pointer' } : {}}
        onClick={onClick}
      >
        {value || '-'}
      </div>
    </div>
  );

  const handleObjectClick = () => {
    if (userRole === 'owner' && onNavigate && data.id_object) {
        onNavigate('obiekty', { objectId: data.id_object });
    }
  };

  return (
    <div className="object-details">
      <div className="detail-header">
        <h2 className="detail-title">
            Czynsz #{data.id}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className={`status-badge ${data.is_paid ? 'success' : 'error'}`}>
                {data.is_paid ? 'Opłacony' : 'Nieopłacony'}
            </span>
            <span className={`status-badge ${data.is_accepted ? 'primary' : 'warning'}`}>
                {data.is_accepted ? 'Zaakceptowany' : 'Oczekuje'}
            </span>
        </div>
      </div>

      <div className="detail-grid">
        <DetailItem 
            label="Obiekt" 
            value={data.object_name} 
            onClick={userRole === 'owner' ? handleObjectClick : undefined}
        />
        {userRole === 'owner' ? (
             <DetailItem label="Najemca" value={`${data.renter_name} (${data.renter_email})`} />
        ) : (
             <DetailItem label="Właściciel" value={`${data.owner_first_name} ${data.owner_last_name} (${data.owner_email})`} />
        )}
        <DetailItem label="Kwota" value={`${typeof data.amount === 'number' ? data.amount.toFixed(2) : data.amount} PLN`} />
        <DetailItem label="Termin płatności" value={formatDate(data.date)} />
        <DetailItem label="Data zapłaty" value={formatDate(data.date_paid)} />
      </div>

      {userRole === 'owner' && (
      <div className="detail-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {(!data.is_accepted && !data.is_paid) && (
            <Button variant="outline" onClick={onEdit}>
                Edytuj czynsz
            </Button>
        )}
        {!data.is_accepted && (
            <Button variant="primary" onClick={onAccept}>
                Zaakceptuj czynsz
            </Button>
        )}
      </div>
      )}

      {userRole !== 'owner' && (
          <div className="detail-actions" style={{ marginTop: '1rem' }}>
              <Button 
                variant="primary" 
                onClick={onConfirmPaid}
                disabled={!data.is_accepted || data.is_paid}
              >
                  {data.is_paid ? 'Opłacono' : 'Potwierdź płatność'}
              </Button>
          </div>
      )}
    </div>
  );
};

export default FullRentDetails;
