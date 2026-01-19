import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const Dashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');

  const handleNavigate = (pageId) => {
    if (pageId === 'logout') {
      onLogout();
    } else {
      setActivePage(pageId);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      
      <main className="dashboard-content">
        <div className="content-container glass-panel">
          {activePage === 'dashboard' && (
            <div>
              <h1 className="page-header">Witaj w panelu głównym</h1>
              <p className="page-text">Wybierz opcję z menu po lewej stronie.</p>
            </div>
          )}
          
          {activePage === 'obiekty' && (
            <div>
              <h1 className="page-header">Moje Obiekty</h1>
              <p className="page-text">Tutaj pojawi się lista Twoich nieruchomości.</p>
              {/* Placeholder for future objects list */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
