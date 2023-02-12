import { hardhat, goerli, mainnet } from "@wagmi/chains";

const chains = { 1: mainnet, 5: goerli, 31337: hardhat };

export const contract =
  process.env.REACT_APP_CONTRACT_ADDRESS ||
  "0x5fbdb2315678afecb367f032d93f642f64180aa3";
export const chainId = process.env.REACT_APP_CHAIN_ID || 31337;
export const chain = chains[chainId];
export const ticketsFromUser = "ticketsFromUser";
export const createEvent = "createEvent";
export const buyTicket = "buyTicket";
export const getBalance = "getBalance";
export const hasATicket = "hasATicket";
export const isOwner = "isOwner";
export const withdraw = "withdraw";
export const METADATA_API =
  process.env.REACT_APP_METADATA_API || "http://localhost:3001/events";
export const CONVERTER_API =
  process.env.REACT_APP_CONVERTER_API ||
  "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
