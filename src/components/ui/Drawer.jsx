import { useRef, useEffect } from 'react';

const Drawer = ({ isOpen, onClose, title, children }) => {
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent scroll on body when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div 
        className="drawer-panel" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="drawer-title"
        ref={drawerRef}
      >
        <div className="drawer-header">
          <h3 id="drawer-title" className="drawer-title">{title}</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="drawer-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
