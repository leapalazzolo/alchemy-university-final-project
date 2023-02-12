require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  allowUnlimitedContractSize: true,
  networks: {
    docker: {
      chainId: 31337,
      url: "http://node:8545",
    },
  },
};
