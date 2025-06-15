// src/lib/contract.ts
import { ethers } from 'ethers';

// Your deployed contract address
const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

// Your full ABI JSON here (make sure it’s valid!)
import CONTRACT_ABI from './RentalContractABI.json';

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner(); // ✅ Await here
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
