import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [newBalance, setNewBalance] = useState('');

  // Fetch user data
  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/api/admin/users/${id}`);

      // Adjust according to your API response structure
      const userData = res.data.user || res.data;
      setUser(userData);
      setNewBalance(userData.btc_balance);
    } catch (error) {
      console.error('Fetch user error:', error);
      toast.error('Failed to fetch user');
      navigate('/admin/users');
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Update user balance
  const handleUpdateBalance = async () => {
    try {
      await axiosInstance.put(
        `/api/admin/users/${id}/balance`,
        { newBalance: parseFloat(newBalance) }
      );

      toast.success('Balance updated successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Update balance error:', error);
      toast.error('Failed to update balance');
    }
  };

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-card-dark rounded-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Edit User Balance</h1>
      <p className="text-text-secondary mb-4">
        User: {user.name} ({user.email})
      </p>

      <div className="mb-4">
        <label className="block text-text-secondary mb-2">BTC Balance</label>
        <input
          type="number"
          step="0.00000001"
          value={newBalance}
          onChange={(e) => setNewBalance(e.target.value)}
          className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sidebar-active"
        />
      </div>

      <button
        onClick={handleUpdateBalance}
        className="bg-sidebar-active text-white px-6 py-2 rounded hover:opacity-90"
      >
        Update Balance
      </button>
    </div>
  );
};

export default AdminEditUser;
