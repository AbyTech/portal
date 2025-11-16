import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Wallet, 
  MessageCircle, 
  Download, 
  Upload, 
  History, 
  Users,
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Wallet', path: '/wallet-connect' },
    { icon: MessageCircle, label: 'Support', path: '/support' },
    { icon: Download, label: 'Deposit', path: '/deposit' },
    { icon: Upload, label: 'Withdraw', path: '/withdraw' },
    { icon: History, label: 'Withdraw History', path: '/withdraw-history' },
  ];

  // Add admin menu item only for admin users
  if (user?.isAdmin) {
    menuItems.push({ icon: Users, label: 'Admin Panel', path: '/admin/dashboard' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-sidebar bg-sidebar-inactive min-h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white gradient-text">Premier recovery and monetization portal</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-8">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-6 py-4 text-left transition-colors ${
                isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-text-secondary hover:bg-card-dark hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-card-dark">
        <button
          onClick={handleLogout}
          className="flex items-center text-text-secondary hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;