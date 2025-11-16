import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'; // Removed ExternalLink
import axios from 'axios';
import toast from 'react-hot-toast';


const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [btcPrice, setBtcPrice] = useState(107038);
  const [ethPrice, setEthPrice] = useState(3724.71);

  useEffect(() => {
    fetchTransactions();
    fetchCryptoPrices();

    const intervalId = setInterval(fetchTransactions, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const fetchTransactions = async () => {
    // Generate random transactions for demonstration
    const generateRandomTx = () => {
      const type = Math.random() > 0.5 ? 'received' : 'sent';
      const amount = (Math.random() * 0.5).toFixed(5);
      const address = 'bc1q' + [...Array(38)].map(() => Math.random().toString(36)[2]).join('');
      const timestamp = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7); // within last 7 days
      return { type, amount, address, timestamp };
    };
    setTransactions([...Array(5)].map(generateRandomTx));
  };

  const fetchCryptoPrices = async () => {
    // Mock prices - in real app, fetch from API
    setBtcPrice(107038);
    setEthPrice(3724.71);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Your Dashboard</h1>
        <p className="text-text-secondary">Manage your cryptocurrency portfolio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Balance Card */}
          <div className="bg-card-dark rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Wallet Balance</h2>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">
                BTC Balance: {user?.btcBalance?.toFixed(8) || '0.00000000'} BTC
              </p>
              <p className="text-text-secondary text-lg">
                ${((user?.btcBalance || 0) * btcPrice).toFixed(2)} USD
              </p>
              <p className="text-text-secondary text-sm mt-4">
                Your connected Bitcoin wallet balance located...
              </p>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="bg-gradient-neon text-white px-6 py-2 rounded-lg font-medium">
                View: WEB
              </button>
              <button className="bg-card-darker text-white px-6 py-2 rounded-lg font-medium border border-card-dark">
                Withdraw
              </button>
              <button className="bg-card-darker text-white px-6 py-2 rounded-lg font-medium border border-card-dark">
                Support
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-card-dark rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
              <button className="text-sidebar-active text-sm font-medium">View more</button>
            </div>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-card-darker rounded-lg hover:bg-card-dark transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'received' ? 'bg-transaction-green' : 'bg-transaction-red'
                    } bg-opacity-20`}>
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
                        {transaction.type === 'received' ? 'from' : 'to'} {formatAddress(transaction.address)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                      transaction.type === 'received' 
                        ? 'bg-transaction-green bg-opacity-20 text-transaction-green'
                        : 'bg-transaction-red bg-opacity-20 text-transaction-red'
                    }`}>
                      {transaction.type === 'received' ? '+' : '-'}{transaction.amount} BTC
                    </span>
                    <p className="text-text-secondary text-sm mt-1">
                      {getTimeAgo(transaction.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* BTC Price */}
          <div className="bg-card-dark rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Bitcoin ${btcPrice.toLocaleString()}</h3>
            <p className="text-text-secondary text-sm">Live Bitcoin price in USD.</p>
          </div>

          {/* ETH Price */}
          <div className="bg-card-dark rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Ethereum ${ethPrice.toLocaleString()}</h3>
            <p className="text-text-secondary text-sm">Live Ethereum price in USD.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;