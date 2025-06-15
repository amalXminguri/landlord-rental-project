// lib/contract.js
import { ethers } from "ethers";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

// Replace with your contract ABI (truncated version shown here)
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "leaseId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "raisedBy", "type": "address" }
    ],
    "name": "DisputeRaised",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  // 🔁 Add more functions as needed (createLease, getLeaseDetails, etc.)
];

export const getContract = () => {
  if (!window.ethereum) throw new Error("MetaMask not detected");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
