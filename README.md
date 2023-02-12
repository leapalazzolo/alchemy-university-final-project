# Alchemy university final project

## Description

I made a project called "tick3ts" where you can save events and buy tickets. It involves:

- Solidity smart contract
- Backend
- React Frontend

## Solidity smart contract

The code is placed here [contract](contract). I created the project using hardhat and there're some command available:

- `npx hardhat node`: it starts a local node
- `npx hardhat compile`: it compiles the contract [contract/contracts/Events.sol](contract/contracts/Events.sol)
- `npx hardhat test`: it runs the tests [contract/test/Events.js](contract/test/Events.js)
- `npx hardhat run scripts/bootstrap.js --network localhost`: it deploys the contract in the local node (you have to start it first) and the create some events. The script is [contract/scripts/bootstrap.js](contract/scripts/bootstrap.js)

## Backend

Saving data to the blockchain is very expensive so I'm using a backend service to store metadata such as images, description, tags, etc. This backend is mocked using `json-server`

`json-server --watch db.json --port 3001`

## React Frontend

The front-end is placed in [tick3ts](tick3ts) was made using React, chakra-ui and wagmi (hooks based on ethers.js)

To run the project set the environment variables `CONTRACT_ADDRESS` and `CHAIN_ID` and then run `npm run start`

## Run the project

### Requisites

Use a wallet with the localhost network (it requires the chainId 31337)

### Docker

Run the command `docker-compouse up`. Then open the url "http://localhost:300" in your browser.

### Without Docker

#### Node

1. Open [contract](contract) and run `npx hardhat node`
2. In a new terminal run `npx hardhat compile` and `npx hardhat run scripts/bootstrap.js --network localhost`

#### Backend

1. Open [backend](backend) and run `json-server --watch db.json  --port 3001`

#### Frontend

1. Open [frontend](frontend) and run `npm run start`
