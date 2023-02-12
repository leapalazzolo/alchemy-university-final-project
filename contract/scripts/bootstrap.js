const utils = require("./utils");

async function bootstrap() {
  const today = new Date();
  const firstDate = new Date();
  const secondDate = new Date();

  firstDate.setDate(today.getDate() + 10);
  secondDate.setDate(today.getDate() + 30);

  const [owner, firstAccount, secondAccount] = await ethers.getSigners();
  const event = await utils.deploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  await event.createEvent(
    100,
    ethers.utils.parseEther("0.1"),
    firstDate.getTime()
  );
  console.log("Created first event with two tickets");
  await event.giveTicket(0, firstAccount.address);
  await event
    .connect(secondAccount)
    .buyTicket(0, { value: ethers.utils.parseEther("1.66") });

  console.log("Created second event with one ticket");

  await event
    .connect(firstAccount)
    .createEvent(3, ethers.utils.parseEther("0.1"), secondDate.getTime());

  await event
    .connect(secondAccount)
    .buyTicket(1, { value: ethers.utils.parseEther("0.1") });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
