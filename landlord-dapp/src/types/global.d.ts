interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (eventName: string, callback: (...args: any[]) => void) => void;
}

interface Window {
  ethereum?: EthereumProvider;
}
