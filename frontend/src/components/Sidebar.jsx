import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CloudSun, Map, Bot, FileText, LogOut } from 'lucide-react';

// ✅ Yahan { onLogout } prop receive kiya
const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/farmer', icon: <LayoutDashboard size={20} /> },
    { name: 'Mission Planner', path: '/farmer/missions', icon: <Map size={20} /> }, // Future page
    { name: 'Weather', path: '/farmer/weather', icon: <CloudSun size={20} /> },     // Future page
    { name: 'Robot Status', path: '/farmer/robot', icon: <Bot size={20} /> },       // Future page
    { name: 'Crop Rec.', path: '/farmer/crops', icon: <FileText size={20} /> },     // Future page
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col p-4 fixed left-0 top-0 overflow-y-auto">
      <div className="text-2xl font-bold mb-8 text-green-400 text-center tracking-wider">🌾 KISAAN AI</div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              location.pathname === item.path 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'hover:bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-700 pt-4 mt-auto">
        {/* ✅ Yahan onClick={onLogout} add kiya */}
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

export default Sidebar;