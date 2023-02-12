const hre = require("hardhat");

async function deploy() {
    const Events = await hre.ethers.getContractFactory("Events");
    const events = await Events.deploy();
   
    console.log(
      `Events contract deployed to ${events.address}`
    );
    return events
  }
  
  
module.exports = { deploy };