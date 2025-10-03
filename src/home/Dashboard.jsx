import React, { useState } from 'react';
import './Dashboard.css';
import { Home, Package, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import TindaWiseLogo from '../assets/TindaWiseLogoRectangle.png';
import './Inventory'
import Inventory from './Inventory';
import Dashboardpage from './Dashboardpage';
import Reports from './Reports';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('inventory');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="brand">
            <img src={TindaWiseLogo} alt="TindaWise Logo" className="brand-logo" />
          </div>
        </div>
        <div className="header-right">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="User"
            className="user-avatar"
          />
          <div>
            <div className="user-name">Username</div>
            <div className="user-role">Owner</div>
          </div>
        </div>
      </header>

      <div className="main-container">
       
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="nav">
            {[
              { icon: Home, label: 'Dashboard', id: 'dashboard' },
              { icon: Package, label: 'Inventory', id: 'inventory' },
              { icon: BarChart3, label: 'Reports', id: 'reports' }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="sidebar-footer">
            <button className="nav-item">
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button className="nav-item">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className={`main-content ${sidebarOpen ? 'with-sidebar' : ''}`}>
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'inventory' && <InventoryPage />}
          {currentPage === 'reports' && <ReportsPage />}
        </main>
      </div>
    </div>
  );
};

const DashboardPage = () => (
  <div className="page-card">
    <h2 className="page-title">Dashboard</h2>
    <Dashboardpage />
  </div>
);

const InventoryPage = () => (
  <div className="page-card">
    <h2 className="page-title">Inventory</h2>
    <Inventory />
  </div>
);

const ReportsPage = () => (
  <div className="page-card">
    <h2 className="page-title">Reports</h2>
    <Reports />
  </div>
);

export default Dashboard;
