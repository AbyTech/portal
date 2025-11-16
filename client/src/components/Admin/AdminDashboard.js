import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newBalance, setNewBalance] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get('/api/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users.');
      console.error('Fetch users error:', error);
    }
  };

  const handleUpdateClick = (user) => {
    setEditingUser(user);
    setNewBalance(user.btcBalance);
  };

  const handleBalanceUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const toastId = toast.loading('Updating balance...');
    try {
      const { data: updatedUser } = await axiosInstance.put(
        `/api/admin/users/${editingUser._id}/balance`,
        { btcBalance: parseFloat(newBalance) }
      );

      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      toast.success('Balance updated successfully!', { id: toastId });
      setEditingUser(null);
      setNewBalance('');
    } catch (error) {
      toast.error('Failed to update balance.', { id: toastId });
      console.error('Update balance error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="bg-card-dark rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">User Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-card-darker">
              <tr>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">BTC Balance</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                  <td className="px-6 py-4">
                    {editingUser?._id === user._id ? (
                      <form onSubmit={handleBalanceUpdate}>
                        <input
                          type="number"
                          step="any"
                          value={newBalance}
                          onChange={(e) => setNewBalance(e.target.value)}
                          className="bg-gray-700 text-white rounded px-2 py-1 w-32"
                        />
                      </form>
                    ) : (
                      user.btcBalance?.toFixed(8) || '0.00000000'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingUser?._id === user._id ? (
                      <button onClick={handleBalanceUpdate} className="font-medium text-blue-500 hover:underline">Save</button>
                    ) : (
                      <button onClick={() => handleUpdateClick(user)} className="font-medium text-blue-500 hover:underline">Update Balance</button>
                    )}
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

export default AdminDashboard;

