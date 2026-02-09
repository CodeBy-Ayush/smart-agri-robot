import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
//Layout of Admin So it can access from here
const AdminLayout = ({ onLogout }) => {
  return (
    <div className="flex bg-slate-100 min-h-screen font-sans">
      <AdminSidebar onLogout={onLogout} />
      <div className="ml-64 flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
