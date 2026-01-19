import { useEffect } from 'react';
import Button from './Button';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Potwierdź', 
  cancelText = 'Anuluj',
  isDestructive = false
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
        </div>
        
        <div className="modal-body" style={{ margin: '1.5rem 0', color: 'var(--text-secondary)' }}>
          {message}
        </div>
        
        <div className="modal-footer" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={isDestructive ? 'primary' : 'primary'} 
            onClick={onConfirm}
            style={isDestructive ? { backgroundColor: '#ef4444', borderColor: '#ef4444' } : {}}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
