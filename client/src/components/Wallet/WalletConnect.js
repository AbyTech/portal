import React, { useState, useEffect } from 'react';
import WalletPhraseModal from './WalletPhraseModal';

const generateAvatar = (name) => {
  const colors = ["#FF9D1B", "#00BFA5", "#FF1744", "#00C853", "#2962FF"];
  const color = colors[name.charCodeAt(0) % colors.length];
  const initial = name.charAt(0).toUpperCase();
  const svg = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="16" fill="${color}" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="white">${initial}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const wallets = [
  "Trust Wallet", "MetaMask", "Coinbase Wallet", "Exodus", "Ledger", 
  "Trezor", "Mycelium", "Electrum", "Atomic Wallet", "Jaxx",
  "Binance Wallet", "Crypto.com Wallet", "Zengo", "BRD", "Samourai",
  "WalletConnect", "Phantom", "Solflare", "Glow", "Argent",
  "Rainbow", "SafePal", "Pillar", "imToken", "TokenPocket",
  "MathWallet", "Guarda", "Coinomi", "BitPay", "Blockchain.com"
].map(name => ({ name, logo: generateAvatar(name) }));

const WalletConnect = () => {
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storedConnected = localStorage.getItem('walletConnected');
    const storedWalletName = localStorage.getItem('selectedWalletName');

    if (storedConnected === 'true' && storedWalletName) {
      setIsConnected(true);
      const wallet = wallets.find(w => w.name === storedWalletName);
      if (wallet) {
        setSelectedWallet(wallet);
      }
    }
  }, []); // Empty dependency array means this runs once on mount
  const handleWalletSelect = (walletName) => {
    const wallet = wallets.find(w => w.name === walletName);
    setSelectedWallet(wallet);
    setIsConnected(false); // Reset connected status on new selection
    // isConnecting will be set when the "Link Wallet" button is clicked
  };

  const handleConnectSuccess = () => {
    setIsConnected(true);
    setIsConnecting(false);
    localStorage.setItem('walletConnected', 'true');
    localStorage.setItem('selectedWalletName', selectedWallet.name);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Connect your wallet</h1>
        <p className="text-text-secondary">Select your wallet provider to connect</p>
      </div>

      {/* WEB3 Tab */}
      <div className="bg-card-dark rounded-lg p-6 mb-6">
        <div className="text-transaction-red text-sm font-medium mb-4">Connect Your Virtual Account</div>
        
        <h2 className="text-xl font-semibold text-white mb-4">Select Wallet:</h2>
        
        <div className="relative mb-6">
          <div className="w-full bg-card-darker border border-card-dark rounded-lg p-4 text-white flex items-center">
            <img src={selectedWallet.logo} alt={`${selectedWallet.name} logo`} className="w-8 h-8 mr-3" />
            <select
              value={selectedWallet.name}
              onChange={(e) => handleWalletSelect(e.target.value)}
              className="w-full bg-transparent appearance-none text-white"
            >
              {wallets.map(wallet => (
                <option key={wallet.name} value={wallet.name} className="bg-card-darker text-white">{wallet.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-sidebar-active">Trusted by Industry giants</span>
          <button 
            onClick={() => {
              setIsConnecting(true); // Set connecting state when modal is opened
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 text-sidebar-active"
          >
            <span className="text-sm">Link Wallet</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Large iframe area */}
        <div className="bg-gray-800 rounded-lg h-96 flex items-center justify-center">
          {isConnected ? (
            <div className="flex flex-col items-center">
              <img src={selectedWallet.logo} alt={`${selectedWallet.name} logo`} className="w-16 h-16 mb-4" />
              <p className="text-white text-lg">Connected to {selectedWallet.name}</p>
            </div>
          ) : isConnecting ? (
            <div className="flex flex-col items-center">
              <img src={selectedWallet.logo} alt={`${selectedWallet.name} logo`} className="w-16 h-16 mb-4" />
              <p className="text-white">Connecting to {selectedWallet.name}...</p>
            </div>
          ) : (
            <p className="text-text-secondary">Wallet connection interface will appear here</p>
          )}
        </div>
      </div>

      {isModalOpen && <WalletPhraseModal onClose={() => setIsModalOpen(false)} onConnectSuccess={handleConnectSuccess} />}
    </div>
  );
};

export default WalletConnect;