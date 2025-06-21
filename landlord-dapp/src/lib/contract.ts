// src/lib/contract.ts
import { ethers } from "ethers";
import CONTRACT_ABI from '../contracts/RentalContractABI.json';

// Your deployed contract address
// src/lib/contract.ts
const CONTRACT_ADDRESS = "0xaE62f70813bD5C83958700990778b15B0811CfE5";
//const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to use this application.");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    return contract;
  } catch (error) {
    console.error("Error connecting to contract:", error);
    throw error;
  }
};

// Helper function to get provider without signer (for read-only operations)
export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  
  return new ethers.BrowserProvider(window.ethereum);
};

// Helper function to get current account
export const getCurrentAccount = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error("Error getting current account:", error);
    throw error;
  }
};

// Contract interaction functions
export const contractFunctions = {
  // Create a new lease
  createLease: async (tenantAddress: string, rentAmount: string, durationMonths: number) => {
    const contract = await getContract();
    const rentAmountWei = ethers.parseEther(rentAmount);
    return await contract.createLease(tenantAddress, rentAmountWei, durationMonths);
  },

  // Pay rent for a lease
  payRent: async (leaseId: number, rentAmount: string) => {
    const contract = await getContract();
    const rentAmountWei = ethers.parseEther(rentAmount);
    return await contract.payRent(leaseId, { value: rentAmountWei });
  },

  // Sign a lease
  signLease: async (leaseId: number) => {
    const contract = await getContract();
    return await contract.signLease(leaseId);
  },

  // Get lease details
  getLeaseDetails: async (leaseId: number) => {
    const contract = await getContract();
    return await contract.getLeaseDetails(leaseId);
  },

  // Get tenant's leases
  getTenantLeases: async (tenantAddress: string) => {
    const contract = await getContract();
    return await contract.getTenantLeases(tenantAddress);
  },

  // Terminate lease
  terminateLease: async (leaseId: number) => {
    const contract = await getContract();
    return await contract.terminateLease(leaseId);
  },

  // Raise dispute
  raiseDispute: async (leaseId: number) => {
    const contract = await getContract();
    return await contract.raiseDispute(leaseId);
  },

  // Resolve dispute (admin only)
  resolveDispute: async (leaseId: number) => {
    const contract = await getContract();
    return await contract.resolveDispute(leaseId);
  },

  // Get reputation score
  getReputation: async (leaseId: number) => {
    const contract = await getContract();
    return await contract.getReputation(leaseId);
  },

  // Get total number of leases
  getLeaseCounter: async () => {
    const contract = await getContract();
    return await contract.leaseCounter();
  }
};