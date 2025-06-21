// src/hooks/useWeb3.ts
import { useEffect, useState, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { getContract, getProvider, getCurrentAccount } from "../lib/contract";

// Define a proper type for the Ethereum provider
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (...args: any[]) => void) => void;
  removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}

// Extend the Window interface with proper typing
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

interface ContractFunctions {
  createLease: (tenant: string, rent: string, months: number) => Promise<ethers.ContractTransactionResponse>;
  payRent: (leaseId: number, rentAmount: string) => Promise<ethers.ContractTransactionResponse>;
  signLease: (leaseId: number) => Promise<ethers.ContractTransactionResponse>;
  getLeaseDetails: (leaseId: number) => Promise<any>;
}

interface UseWeb3Return {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  contractFunctions: ContractFunctions;
  currentAccount: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export function useWeb3(): UseWeb3Return {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Provider = getProvider();
      const { chainId } = await web3Provider.getNetwork();
      
      const web3Signer = await web3Provider.getSigner();
      const address = await getCurrentAccount();
      const web3Contract = await getContract();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(web3Contract);
      setCurrentAccount(address);
      setIsConnected(true);
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      setError(err.message || "Failed to connect wallet");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setCurrentAccount("");
    setIsConnected(false);
    setError(null);
  }, []);

  const contractFunctions = useMemo(() => ({
    createLease: async (tenant: string, rent: string, months: number) => {
      if (!contract) throw new Error("Contract not connected");
      return contract.createLease(tenant, ethers.parseEther(rent), months);
    },
    payRent: async (leaseId: number, rentAmount: string) => {
      if (!contract) throw new Error("Contract not connected");
      return contract.payRent(leaseId, { value: ethers.parseEther(rentAmount) });
    },
    signLease: async (leaseId: number) => {
      if (!contract) throw new Error("Contract not connected");
      return contract.signLease(leaseId);
    },
    getLeaseDetails: async (leaseId: number) => {
      if (!contract) throw new Error("Contract not connected");
      return contract.getLeaseDetails(leaseId);
    }
  }), [contract]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnectWallet();
      else if (accounts[0] !== currentAccount) connectWallet();
    };

    const handleChainChanged = () => window.location.reload();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [currentAccount, connectWallet, disconnectWallet]);

  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) await connectWallet();
        } catch (err) {
          console.error("Auto-connect failed:", err);
        }
      }
    };
    autoConnect();
  }, [connectWallet]);

  return {
    provider,
    signer,
    contract,
    contractFunctions,
    currentAccount,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  };
}