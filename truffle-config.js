require('dotenv').config();
const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { MNEMONIC } = process.env;

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `wss://eth-sepolia.g.alchemy.com/v2/3Rx6utepgfugaHe2ngrto`
        ),
      network_id: 11155111, // Sepolia network ID
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      websocket: true,
    },
  },

  compilers: {
    solc: {
      version: "0.8.21",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },

  mocha: {
    // timeout: 100000
  },

  // Optional Truffle DB config
  // db: {
  //   enabled: false,
  // },
};
