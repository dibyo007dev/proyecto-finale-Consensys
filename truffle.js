//https://rinkeby.infura.io/v3/8cbf86fab8e54099900e489f0db2d39d

const HDWalletProvider = require("truffle-hdwallet-provider");

const fs = require("fs");
const fs2 = require("fs");

const infuraKey = fs
  .readFileSync(".infuraKey")
  .toString()
  .trim();
const mnemonic = fs2
  .readFileSync(".mnemonic")
  .toString()
  .trim();

/**
 * Use this file to configure your truffle project. It's seeded with some
 **/

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
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },

    rinkeby: {
      host: "localhost",
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://rinkeby.infura.io/v3/${infuraKey}`
        ),
      port: 8545,
      network_id: 4,
      gas: 4700000
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {}
  }
};
