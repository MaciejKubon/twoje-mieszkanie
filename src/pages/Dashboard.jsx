import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Overview from './dashboard/Overview';
import MyObjects from './dashboard/MyObjects';
import Settings from './dashboard/Settings';

const Dashboard = ({ onLogout, showSnackbar }) => {
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
          {activePage === 'dashboard' && <Overview />}
          {activePage === 'obiekty' && <MyObjects showSnackbar={showSnackbar} />}
          {activePage === 'settings' && <Settings showSnackbar={showSnackbar} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
