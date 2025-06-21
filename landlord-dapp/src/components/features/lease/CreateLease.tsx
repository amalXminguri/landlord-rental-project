// src/components/features/lease/CreateLease.tsx
import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../../../hooks/useWeb3';

export default function CreateLease() {
  const { contract, isConnected, connectWallet, isLoading: isWalletLoading } = useWeb3();
  const [tenant, setTenant] = useState('');
  const [rent, setRent] = useState('');
  const [duration, setDuration] = useState(12);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!contract) return;
    
    try {
      setError('');
      setIsSubmitting(true);
      
      // Trim whitespace and validate tenant address
      const trimmedTenant = tenant.trim();
      
      if (!trimmedTenant) {
        throw new Error('Tenant address is required');
      }
      
      if (!ethers.isAddress(trimmedTenant)) {
        throw new Error('Invalid Ethereum address format');
      }
      
      if (!rent || Number(rent) <= 0) {
        throw new Error('Rent amount must be greater than 0');
      }

      if (duration <= 0) {
        throw new Error('Duration must be greater than 0');
      }

      console.log('Creating lease with:', {
        tenant: trimmedTenant,
        rent: rent,
        duration: duration
      });

      const rentWei = ethers.parseEther(rent);
      const tx = await contract.createLease(trimmedTenant, rentWei, duration);
      
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      window.location.reload();
      
      alert('Lease created successfully!');
      setTenant('');
      setRent('');
      setDuration(12);
    } catch (err: any) {
      console.error('Error creating lease:', err);
      
      // Handle specific error types
      if (err.code === 'INVALID_ARGUMENT') {
        setError('Invalid input parameters. Please check your values.');
      } else if (err.code === 'UNPREDICTABLE_GAS_LIMIT') {
        setError('Transaction may fail. Please check your contract and inputs.');
      } else if (err.message.includes('user rejected')) {
        setError('Transaction was rejected by user');
      } else {
        setError(err.message || 'Failed to create lease');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 text-center">
        <button 
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isWalletLoading}
        >
          {isWalletLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Lease</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Tenant Address:</label>
        <input
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
          placeholder="0x1234567890123456789012345678901234567890"
        />
        {tenant && !ethers.isAddress(tenant.trim()) && (
          <p className="text-red-500 text-sm mt-1">Invalid Ethereum address format</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Monthly Rent (ETH):</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          placeholder="0.1"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Duration (months):</label>
        <input
          type="number"
          min="1"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>
      
      <button 
        className={`w-full py-2 px-4 rounded text-white font-medium ${
          isSubmitting || !tenant.trim() || !rent || Number(rent) <= 0 || !ethers.isAddress(tenant.trim())
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={handleSubmit}
        disabled={isSubmitting || !tenant.trim() || !rent || Number(rent) <= 0 || !ethers.isAddress(tenant.trim())}
      >
        {isSubmitting ? 'Creating Lease...' : 'Create Lease'}
      </button>
    </div>
  );
}