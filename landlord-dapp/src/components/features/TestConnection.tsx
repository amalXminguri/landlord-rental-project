import { useWeb3 } from "../../hooks/useWeb3";

export default function TestConnection() {
  const { 
    isConnected,
    currentAccount,
    connectWallet,
    contract
  } = useWeb3();

  const testContract = async () => {
    try {
      if (!contract) throw new Error("Contract not loaded");
      
      // Test 1: Get admin address
      const admin = await contract.admin();
      console.log("Admin address:", admin);
      
      // Test 2: Get lease counter
      const counter = await contract.leaseCounter();
      console.log("Total leases:", Number(counter));
      
      alert("Contract connection works! ✅");
    } catch (error) {
      console.error("Connection test failed:", error);
      alert("Test failed ❌\nCheck browser console");
    }
  };

  return (
    <div style={{ margin: "20px", padding: "10px", border: "1px solid gray" }}>
      <h3>Connection Test</h3>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect Wallet First</button>
      ) : (
        <>
          <p>Connected as: {currentAccount}</p>
          <button onClick={testContract}>Test Contract</button>
        </>
      )}
    </div>
  );
}