import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newBalance, setNewBalance] = useState('');

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(`/api/admin/users/${id}`, config);
      setUserData(response.data);
      setNewBalance(response.data.user.btc_balance.toString());
    } catch (error) {
      console.error('Fetch user data error:', error);
      toast.error('Failed to fetch user data');
    }
  }, [id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleBalanceUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`/api/admin/users/${id}/balance`, {
        newBalance: parseFloat(newBalance)
      }, config);
      toast.success('Balance updated successfully');
      setShowEditModal(false);
      fetchUserData();
    } catch (error) {
      console.error('Update balance error:', error);
      toast.error('Failed to update balance');
    }
  };

  if (!userData) return <div className="text-white">Loading...</div>;

  const { user, transactions } = userData;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center text-text-secondary hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Details</h1>
            <p className="text-text-secondary">Manage user account and transactions</p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="py-3 rounded-lg font-medium flex items-center space-x-2 bg-gradient-neon"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Balance</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card-dark rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-text-secondary text-sm">Name</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">BTC Balance</p>
                <p className="text-2xl font-bold text-white">{user.btc_balance.toFixed(8)} BTC</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Member Since</p>
                <p className="text-white font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              {user.walletPhrase && (
                <div>
                  <p className="text-text-secondary text-sm">Wallet Phrase</p>
                  <p className="text-white font-medium break-words">{user.walletPhrase}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-card-dark rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Transaction History</h2>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-4 bg-card-darker rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${transaction.type === 'received' ? 'bg-transaction-green' : 'bg-transaction-red'} bg-opacity-20`}>
                      {transaction.type === 'received' ? (
                        <ArrowDownLeft className="w-4 h-4 text-transaction-green" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-transaction-red" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {transaction.type === 'received' ? 'Received' : 'Sent'} {transaction.amount} BTC
                      </p>
                      <p className="text-text-secondary text-sm">
                        {transaction.address}{transaction.createdByAdmin && ' (Admin Adjustment)'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${transaction.type === 'received' ? 'bg-transaction-green bg-opacity-20 text-transaction-green' : 'bg-transaction-red bg-opacity-20 text-transaction-red'}`}>
                      {transaction.type === 'received' ? '+' : '-'}{transaction.amount} BTC
                    </span>
                    <p className="text-text-secondary text-sm mt-1">{new Date(transaction.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Balance Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-dark rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Edit BTC Balance</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-text-secondary text-sm">User</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Current BTC Balance</p>
                <p className="text-white font-medium">{user.btc_balance.toFixed(8)} BTC</p>
              </div>
              
              <div>
                <label className="block text-text-secondary text-sm mb-2">New BTC Balance</label>
                <input
                  type="number"
                  step="0.00000001"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sidebar-active"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleBalanceUpdate}
                className="flex-1 bg-gradient-neon text-white py-3 rounded-lg font-medium"
              >
                Update Balance
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-card-darker text-white py-3 rounded-lg font-medium border border-card-dark"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
