import React, { useState } from 'react';
import { AirdropRecipient } from '../contracts/AirdropContract';

interface AirdropFormProps {
  onSubmit: (recipients: AirdropRecipient[]) => Promise<void>;
  isProcessing: boolean;
}

export const AirdropForm: React.FC<AirdropFormProps> = ({ onSubmit, isProcessing }) => {
  const [recipientInput, setRecipientInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Parse the input (expected format: accountId,amount\naccountId,amount)
      const recipients = recipientInput
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          const [accountId, amount] = line.split(',').map(part => part.trim());
          if (!accountId || !amount || isNaN(Number(amount))) {
            throw new Error('Invalid format. Please use: accountId,amount');
          }
          return {
            accountId,
            amount: Number(amount)
          };
        });

      if (recipients.length === 0) {
        throw new Error('Please add at least one recipient');
      }

      await onSubmit(recipients);
      setRecipientInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Airdrop Recipients</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter recipients (one per line, format: accountId,amount)
          </label>
          <textarea
            value={recipientInput}
            onChange={(e) => setRecipientInput(e.target.value)}
            className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.0.123456,100&#13;&#10;0.0.789012,50"
            disabled={isProcessing}
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isProcessing ? 'Processing...' : 'Execute Airdrop'}
        </button>
      </form>
    </div>
  );
}; 