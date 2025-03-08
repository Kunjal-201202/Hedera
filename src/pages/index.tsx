import { useState, useEffect } from 'react';
import { Client } from '@hashgraph/sdk';
import { AirdropForm } from '../components/AirdropForm';
import { AirdropContract, AirdropRecipient } from '../contracts/AirdropContract';
import { HashPackConnector } from '../utils/hashpackConnector';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [connector] = useState(() => new HashPackConnector());
  const [contract, setContract] = useState<AirdropContract | null>(null);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        await connector.init();
        setStatus('Wallet initialized. Please connect.');
      } catch (error) {
        setStatus('Failed to initialize wallet. Please refresh the page.');
      }
    };

    initializeWallet();
  }, []);

  const handleConnect = async () => {
    try {
      setStatus('Connecting to wallet...');
      const data = await connector.connectToWallet();
      
      // Initialize the contract with the connected account
      const client = Client.forTestnet();
      // Note: You would need to replace this with your token ID
      const tokenId = "0.0.123456"; // Replace with actual token ID
      
      setContract(new AirdropContract(client, tokenId));
      setIsConnected(true);
      setStatus('Connected to wallet');
    } catch (error) {
      setStatus('Failed to connect wallet. Please try again.');
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = () => {
    connector.disconnect();
    setIsConnected(false);
    setContract(null);
    setStatus('Disconnected from wallet');
  };

  const handleAirdrop = async (recipients: AirdropRecipient[]) => {
    if (!contract) {
      setStatus('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setStatus('Validating recipients...');

    try {
      // Validate recipients
      const validations = await contract.validateRecipients(recipients);
      const invalidRecipients = recipients.filter((_, index) => !validations[index]);
      
      if (invalidRecipients.length > 0) {
        throw new Error(`Invalid recipient addresses found: ${invalidRecipients.map(r => r.accountId).join(', ')}`);
      }

      setStatus('Executing airdrop...');
      const response = await contract.executeAirdrop(recipients);
      
      setStatus(`Airdrop completed successfully! Transaction ID: ${response.transactionId}`);
    } catch (error) {
      setStatus(`Airdrop failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Airdrop error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hedera Token Airdrop Tool
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Easily distribute HBAR or HTS tokens to multiple recipients
          </p>
          
          <button
            onClick={isConnected ? handleDisconnect : handleConnect}
            className={`mb-4 px-6 py-2 rounded-md text-white font-medium
              ${isConnected 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isConnected ? 'Disconnect Wallet' : 'Connect HashPack'}
          </button>
          
          {status && (
            <div className={`text-sm ${status.includes('failed') || status.includes('Failed') 
              ? 'text-red-600' 
              : 'text-green-600'}`}>
              {status}
            </div>
          )}
        </div>

        {isConnected && (
          <AirdropForm
            onSubmit={handleAirdrop}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  );
} 