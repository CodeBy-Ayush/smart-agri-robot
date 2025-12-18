import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, Activity, Settings, LogOut,BarChart3 } from 'lucide-react';

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();
  
  // AdminSidebar.jsx  menuItems updates : 
const menuItems = [
    { name: 'Overview', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Mission Control', path: '/admin-dashboard/missions', icon: <ClipboardList size={20} /> },
    { name: 'User Management', path: '/admin-dashboard/users', icon: <Users size={20} /> },
    { name: 'Global Fleet', path: '/admin-dashboard/robots', icon: <Activity size={20} /> }, // New
  { name: 'Analytics', path: '/admin-dashboard/analytics', icon: <BarChart3 size={20} /> }, // New

];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col p-4 fixed left-0 top-0 border-r border-slate-800">
      <div className="text-2xl font-bold mb-8 text-blue-500 text-center tracking-wider flex items-center justify-center gap-2">
        🛡️ ADMIN PANEL
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'hover:bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 pt-4 mt-auto">
        <button 
          onClick={onLogout}
          className="flex w-full items-center gap-3 p-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
