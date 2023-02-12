npx hardhat compile
cat artifacts/contracts/Events.sol/Events.json | jq .abi > ../tick3ts/src/utils/abi.json