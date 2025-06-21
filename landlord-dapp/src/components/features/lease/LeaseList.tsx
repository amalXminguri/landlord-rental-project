// src/components/features/lease/LeaseList.tsx
import React, { useEffect, useState } from 'react';
import { contractFunctions } from '../../../lib/contract';
import LeaseCard from './LeaseCard';

interface Lease {
  landlord: string;
  tenant: string;
  rentAmount: bigint;
  durationMonths: bigint;
  startDate: bigint;
  paidMonths: bigint;
  status: number;
  onTimePayments: bigint;
  totalPayments: bigint;
  disputeTenant: boolean;
  disputeLandlord: boolean;
}

const LeaseList: React.FC = () => {
  const [leases, setLeases] = useState<{ id: number; lease: Lease }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const total = await contractFunctions.getLeaseCounter();
        const leaseData = [];

        for (let i = 0; i < Number(total); i++) {
          const lease = await contractFunctions.getLeaseDetails(i);
          leaseData.push({
            id: i,
            lease: {
              landlord: lease[0],
              tenant: lease[1],
              rentAmount: lease[2],
              durationMonths: lease[3],
              startDate: lease[4],
              paidMonths: lease[5],
              status: lease[6],
              onTimePayments: lease[7],
              totalPayments: lease[8],
              disputeTenant: lease[9],
              disputeLandlord: lease[10],
            },
          });
        }

        setLeases(leaseData);
      } catch (err) {
        console.error('Error fetching leases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeases();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Leases</h2>
      {loading ? (
        <p>Loading leases...</p>
      ) : leases.length === 0 ? (
        <p>No leases found.</p>
      ) : (
        <div className="space-y-4">
          {leases.map(({ id, lease }) => (
            <LeaseCard key={id} leaseId={id} lease={lease} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaseList;
