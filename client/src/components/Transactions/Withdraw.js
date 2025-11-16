import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Withdraw = () => {
  const [formData, setFormData] = useState({
    address: '',
    amount: ''
  });
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const setMaxAmount = () => {
    setFormData({
      ...formData,
      amount: user?.btcBalance?.toString() || '0'
    });
  };

  const handleWithdraw = async () => {
    if (!formData.address || !formData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseFloat(formData.amount) > user.btcBalance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/withdraw`, {
        amount: parseFloat(formData.amount),
        address: formData.address
      });

      if (response.data.message === 'Withdrawal successful') {
        toast.success('Withdrawal successful!');
        // Refresh user balance
        await refreshUser();
        // Reset form
        setFormData({ address: '', amount: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-text-secondary hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Withdraw BTC</span>
      </button>

      <div className="bg-gradient-neon p-1 rounded-lg">
        <div className="bg-black rounded-lg p-6">
          {/* Chain Info */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Chain: BITCOIN</h2>
            <div className="flex items-center justify-center space-x-2 text-text-secondary">
              <span>| Bitcoin |</span>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Bitcoin Wallet Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-sidebar-active"
              placeholder="Enter Bitcoin address"
            />
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Enter Amount
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.00000001"
                className="flex-1 bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-sidebar-active"
                placeholder="0.00"
              />
              <button
                onClick={setMaxAmount}
                className="bg-sidebar-active text-white px-4 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Max
              </button>
            </div>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            className="w-full bg-gradient-neon text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Withdraw
          </button>

          {/* Instructions */}
          <div className="mt-6 space-y-2 text-text-secondary text-xs">
            <p>• Please Only use Bitcoin addresses to prevent permanent loss of assets.</p>
            <p>• Click "Withdraw after the crypto amount has been selected."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;