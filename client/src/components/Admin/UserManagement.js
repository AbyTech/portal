import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Edit } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-text-secondary">Manage all users and their balances</p>
      </div>

      <div className="bg-card-dark rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-card-darker border border-card-dark rounded-lg pl-10 pr-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-sidebar-active"
          />
        </div>
      </div>

      <div className="bg-card-dark rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-card-darker">
                <th className="px-6 py-4 text-left text-text-secondary font-medium">ID</th>
                <th className="px-6 py-4 text-left text-text-secondary font-medium">Username</th>
                <th className="px-6 py-4 text-left text-text-secondary font-medium">Email</th>
                <th className="px-6 py-4 text-left text-text-secondary font-medium">BTC Balance</th>
                <th className="px-6 py-4 text-left text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-darker">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-card-darker transition-colors">
                  <td className="px-6 py-4 text-white">{user._id.slice(-6)}</td>
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{user.email}</td>
                  <td className="px-6 py-4 text-white">{user.btc_balance.toFixed(8)} BTC</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      className="flex items-center space-x-1 bg-sidebar-active text-white px-3 py-1 rounded text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                      className="flex items-center space-x-1 bg-transaction-green text-white px-3 py-1 rounded text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
