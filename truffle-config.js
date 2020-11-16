/**
 * @author Billy Editiano (bllyanos)
 */
const Web3 = require("web3");
const web3 = new Web3();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const pkey = fs.readFileSync("./secret/byx88-private.key").toString().trim();
const infuraKey = fs.readFileSync("./secret/infura.key").toString().trim();
const etherscankey = fs.readFileSync("./secret/etherscan-api.key").toString().trim();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    ropsten: {
      provider: () => new HDWalletProvider(pkey, `https://ropsten.infura.io/v3/${infuraKey}`),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    kovan: {
      provider: () => new HDWalletProvider(pkey, `https://kovan.infura.io/v3/${infuraKey}`),
      network_id: 42,
      gas: 1200000,
      gasPrice: web3.utils.toWei("30", "gwei"),
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: true
    },
    mainnet: {
      provider: () => new HDWalletProvider(pkey, `https://mainnet.infura.io/v3/${infuraKey}`),
      network_id: 1,
      gas: 1200000,
      gasPrice: web3.utils.toWei("25", "gwei"),
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: true
    }
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  mocha: {},

  compilers: {
    solc: {
      version: "^0.6.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: etherscankey
  }
};
