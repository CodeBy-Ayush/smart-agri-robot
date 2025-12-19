// layouts/FarmerLayout.jsx Update
//Layout of Farmer
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Yahan props me { onLogout } receive karo
const FarmerLayout = ({ onLogout }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {/* Sidebar ko onLogout function pass karo */}
      <Sidebar onLogout={onLogout} />
      
      <div className="ml-64 flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default FarmerLayout;
