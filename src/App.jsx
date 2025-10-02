import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProductProvider } from './context/ProductManagement';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './home/Dashboard';
import Inventory from './home/Inventory';
import Dashboardpage from './home/Dashboardpage';

const App = () => {
  return (
    <ProductProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/dashboard" element={<Dashboardpage />} />
        </Routes>
      </Router>
    </ProductProvider>
  );
};

export default App;