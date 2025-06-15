import { ethers } from "ethers";

// Your deployed contract address
const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

// Define the ABI with type
const CONTRACT_ABI: ethers.InterfaceAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "tenant", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "makePayment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
