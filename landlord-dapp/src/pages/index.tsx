// src/pages/index.tsx
import { useState } from 'react';
import { getContract } from '../lib/contract';

export default function Home() {
  const [admin, setAdmin] = useState('');

  const connectWalletAndFetchAdmin = async () => {
  try {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // ✅ Await the getContract() call
    const contract = await getContract();

    // ✅ Call contract.admin() properly
    const adminAddress = await contract.admin();
    setAdmin(adminAddress);
  } catch (error) {
    console.error('Error connecting to contract:', error);
  }
};


  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '24px' }}>🏠 Landlord DApp</h1>
      <button
        onClick={connectWalletAndFetchAdmin}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          color: '#fff',
          borderRadius: '6px',
          marginTop: '1rem',
        }}
      >
        Connect Wallet & Get Admin
      </button>

      {admin && (
        <p style={{ marginTop: '1rem' }}>
          <strong>Admin Address:</strong> {admin}
        </p>
      )}
    </main>
  );
}
