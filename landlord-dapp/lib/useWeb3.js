import { useEffect, useState } from "react";
import { ethers } from "ethers";
import RentalContractABI from "./RentalContractABI.json";

// 📝 Replace this with your deployed contract address
const CONTRACT_ADDRESS = "0xYourSmartContractAddress";

export function useWeb3() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          await web3Provider.send("eth_requestAccounts", []);
          const signer = web3Provider.getSigner();
          const address = await signer.getAddress();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, RentalContractABI, signer);

          setProvider(web3Provider);
          setSigner(signer);
          setContract(contract);
          setCurrentAccount(address);
        } catch (error) {
          console.error("Wallet connection error:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    connectWallet();
  }, []);

  return { provider, signer, contract, currentAccount };
}
