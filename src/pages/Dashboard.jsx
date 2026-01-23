import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Overview from './dashboard/Overview';
import MyObjects from './dashboard/MyObjects';
import RentAssignment from './dashboard/RentAssignment';
import FullRent from './dashboard/FullRent';
import Settings from './dashboard/Settings';

const Dashboard = ({ onLogout, showSnackbar }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [navigationParams, setNavigationParams] = useState(null);

  const handleNavigate = (pageId, params = null) => {
    if (pageId === 'logout') {
      onLogout();
    } else {
      setActivePage(pageId);
      setNavigationParams(params);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      
      <main className="dashboard-content">
        <div className="content-container glass-panel">
          {activePage === 'dashboard' && <Overview />}
          {activePage === 'obiekty' && (
            <MyObjects 
              showSnackbar={showSnackbar} 
              navigationParams={navigationParams}
            />
          )}
          {activePage === 'rent_assignment' && <RentAssignment showSnackbar={showSnackbar} />}
          {activePage === 'full_rent' && (
            <FullRent 
              showSnackbar={showSnackbar} 
              onNavigate={handleNavigate}
            />
          )}
          {activePage === 'settings' && <Settings showSnackbar={showSnackbar} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
