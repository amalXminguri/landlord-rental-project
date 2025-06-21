// src/components/features/lease/LeaseCard.tsx
import React from 'react';

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

interface LeaseCardProps {
  leaseId: number;
  lease: Lease;
}

const LeaseCard: React.FC<LeaseCardProps> = ({ leaseId, lease }) => {
  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <h3 className="font-semibold mb-2">Lease #{leaseId}</h3>
      <p><strong>Landlord:</strong> {lease.landlord}</p>
      <p><strong>Tenant:</strong> {lease.tenant}</p>
      <p><strong>Rent Amount:</strong> {Number(lease.rentAmount) / 1e18} ETH</p>
      <p><strong>Duration:</strong> {lease.durationMonths.toString()} months</p>
      <p><strong>Status:</strong> {['Pending', 'Active', 'Terminated', 'Disputed'][lease.status]}</p>
    </div>
  );
};

export default LeaseCard;
