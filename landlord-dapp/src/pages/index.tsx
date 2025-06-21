// src/pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import CreateLease from '../components/features/lease/CreateLease';
import LeaseList from '../components/features/lease/LeaseList';
import TestConnection from '../components/features/TestConnection';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Landlord Rental DApp</title>
        <meta name="description" content="Blockchain Rental Management" />
      </Head>

      <main className="container mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Rental Management</h1>
        
        {/* Top Section - Connection Test and Create Lease */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
            <TestConnection />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create New Lease</h2>
            <CreateLease />
          </div>
        </div>

        {/* Bottom Section - View All Leases */}
        <div className="bg-white p-6 rounded-lg shadow">
          <LeaseList />
        </div>
      </main>
    </div>
  );
};

export default Home;