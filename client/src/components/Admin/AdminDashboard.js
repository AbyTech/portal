import React, { useState, useEffect } from 'react';
import { Users, Bitcoin, Activity, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBTC: 0,
    totalTransactions: 0,
    recentTransactions: []
  });

  const fetchStats = async () => {
    try {
      const [usersRes, transactionsRes] = await Promise.all([
        axiosInstance.get('/api/admin/users'),
        axiosInstance.get('/api/admin/transactions')
      ]);

      const users = usersRes.data;
      const transactions = transactionsRes.data;
      const totalBTC = users.reduce((sum, user) => sum + user.btcBalance, 0);
      const recentTransactions = transactions.slice(0, 5);

      setStats({
        totalUsers: users.length,
        totalBTC,
        totalTransactions: transactions.length,
        recentTransactions
      });
    } catch (error) {
      console.error('Admin stats fetch error:', error);
      toast.error('Failed to fetch stats');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-text-secondary">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card-dark rounded-lg p-6 flex justify-between items-center">
          <div>
            <p className="text-text-secondary text-sm">Total Users</p>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
          </div>
          <Users className="w-8 h-8 text-sidebar-active" />
        </div>
        <div className="bg-card-dark rounded-lg p-6 flex justify-between items-center">
          <div>
            <p className="text-text-secondary text-sm">Total BTC Held</p>
            <p className="text-3xl font-bold text-white">{stats.totalBTC.toFixed(8)}</p>
          </div>
          <Bitcoin className="w-8 h-8 text-sidebar-active" />
        </div>
        <div className="bg-card-dark rounded-lg p-6 flex justify-between items-center">
          <div>
            <p className="text-text-secondary text-sm">Total Transactions</p>
            <p className="text-3xl font-bold text-white">{stats.totalTransactions}</p>
          </div>
          <Activity className="w-8 h-8 text-sidebar-active" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card-dark rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/users" className="block bg-card-darker hover:bg-sidebar-active text-white p-4 rounded-lg">
              Manage Users
            </Link>
            <Link to="/admin/transactions" className="block bg-card-darker hover:bg-sidebar-active text-white p-4 rounded-lg">
              View All Transactions
            </Link>
          </div>
        </div>

        <div className="bg-card-dark rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {stats.recentTransactions.map(tx => (
              <div key={tx._id} className="flex items-center justify-between p-3 bg-card-darker rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${tx.type === 'admin_adjustment' ? 'bg-transaction-blue' : 'bg-transaction-red'} bg-opacity-20`}>
                    {tx.type === 'admin_adjustment' ? (
                      <ArrowUpRight className="w-4 h-4 text-transaction-blue" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-transaction-red" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm">{tx.userId?.name || 'User'}</p>
                    <p className="text-text-secondary text-xs">{tx.type} {tx.amount} BTC</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${tx.type === 'admin_adjustment' ? 'text-transaction-blue' : 'text-transaction-red'}`}>
                  {tx.type === 'admin_adjustment' ? '+' : '-'}{tx.amount} BTC
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
