import { createContext, useContext, useMemo } from "react";
import { ethers } from "ethers";

const EthereumContext = createContext(null);

export const EthereumProvider = ({ children }) => {
  const provider = useMemo(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    } else {
      const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_KEY;
      return new ethers.JsonRpcProvider(
        `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
      );
    }
  }, []);

  return (
    <EthereumContext.Provider value={provider}>{children}</EthereumContext.Provider>
  );
};

export const useEth = () => {
  return useContext(EthereumContext);
};
