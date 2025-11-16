import React, { useState } from 'react';
import { Copy } from 'lucide-react'; // Removed unused Search import
import toast from 'react-hot-toast';
import walletQrImage from '../../assets/wallet-qr.jpg';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [coinType, setCoinType] = useState('Bitcoin');
  const walletAddress = 'TVL2GeijfFdSLe9g9VKCTNrUU48t8jmAZj';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Wallet address copied to clipboard!');
  };

  const handleProcessDeposit = () => {
    if (!amount) {
      toast.error('Please enter an amount');
      return;
    }
    toast.success('Deposit processing initiated');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Search */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Track Deposit</h1>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search transaction..."
              className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-sidebar-active"
            />
          </div>
          <button className="bg-gradient-neon">
            Search
          </button>
        </div>
      </div>;

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Process Deposit Card */}
        <div className="bg-card-dark rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Process Deposit</h2>
          
          {/* Wallet Address */}
          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Wallet Address
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-card-darker border border-cyan-500 rounded-lg px-4 py-3 text-white font-mono text-sm">
                {walletAddress}
              </div>
              <button
                onClick={handleCopyAddress}
                className="bg-sidebar-active text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Amount (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-card-darker border border-sidebar-active rounded-lg px-4 py-3 text-white focus:outline-none"
              placeholder="Enter amount in USD"
            />
          </div>

          {/* Coin Type */}
          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Coin Type (make payment to the bitcoin address)
            </label>
            <select
              value={coinType}
              onChange={(e) => setCoinType(e.target.value)}
              className="w-full bg-card-darker border border-cyan-500 rounded-lg px-4 py-3 text-white focus:outline-none"
            >
              <option>Bitcoin</option>
              <option>Ethereum</option>
              <option>USDT</option>
            </select>
          </div>

          {/* Process Button */}
          <button
            onClick={handleProcessDeposit}
            className="w-full bg-gradient-neon text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Process Deposit
          </button>
        </div>

        {/* QR Code Section */}
        <div className="bg-card-dark rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="mb-6 p-4 bg-white rounded-lg">
            <img
              src={walletQrImage}
              alt="Wallet QR Code"
              className="w-48 h-48"
            />
          </div>
          <p className="text-text-secondary text-center text-sm">
            Scan this QR code with your wallet to deposit Bitcoin to your account
          </p>
        </div>
      </div>

      {/* Error Order Section */}
      <div className="mt-8 bg-card-dark rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Error Order (1)</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-text-secondary text-sm font-medium mb-2">Source</h4>
            <div className="bg-card-darker rounded-lg p-4">
              <p className="text-white font-medium">Process Deposit</p>
              <div className="mt-2">
                <p className="text-text-secondary text-sm">Wallet Address</p>
                <p className="text-cyan-400 font-mono text-sm">N:K:Y:Aki@XbaEaQLDqxyAC8jWtT6c4</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-text-secondary text-sm">Amount (USD)</p>
              <p className="text-white">-</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Coin Type</p>
              <p className="text-white">Bitcoin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;