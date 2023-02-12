const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("Events", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployEventsAndGetAccounts() {
    const [owner, firstAccount, secondAccount] = await ethers.getSigners();

    const Events = await ethers.getContractFactory("Events");
    const event = await Events.deploy();

    return { event, owner, firstAccount, secondAccount };
  }

  describe("Events", function () {
    it("Create an event", async function () {
      const eventDate = new Date("2024-01-01").getTime() / 1000;
      const { event, owner } = await loadFixture(deployEventsAndGetAccounts);

      await expect(
        await event.createEvent(
          100,
          ethers.utils.parseEther("0.1"),

          new Date("2024-01-01").getTime() / 1000
        )
      )
        .to.emit(event, "UserEvents")
        .withArgs(owner.address, 0, true);

      const totalEvents = await event.totalEvents();
      expect(totalEvents).to.eq(1);

      const firstEvent = await event.events(0);

      expect(firstEvent.id).to.eq(0);
      expect(firstEvent.price).to.eq(ethers.utils.parseEther("0.1"));
      expect(firstEvent.capacity).to.eq(100);
      expect(firstEvent.date).to.eq(eventDate);
      expect(firstEvent.owner).to.eq(owner.address);
    });
    describe("Should revert the event creation", function () {
      it("Invalid date", async function () {
        const { event } = await loadFixture(deployEventsAndGetAccounts);

        await expect(
          event.createEvent(
            100,
            ethers.utils.parseEther("0.1"),

            new Date("2000-01-01").getTime() / 1000
          )
        ).to.be.revertedWith("Invalid date");
      });
    });
    describe("Get some tickets", function () {
      it("Buy a ticket", async function () {
        const { event, owner, firstAccount, secondAccount } = await loadFixture(
          deployEventsAndGetAccounts
        );

        await event.createEvent(
          100,
          ethers.utils.parseEther("0.1"),
          new Date("2024-01-01").getTime() / 1000
        );
        await expect(
          await event
            .connect(secondAccount)
            .buyTicket(0, { value: ethers.utils.parseEther("1.01") })
        )
          .to.emit(event, "UserEvents")
          .withArgs(secondAccount.address, 0, false)
          .to.emit(event, "TicketNumber")
          .withArgs(2);

        expect(await event.hasATicket(0, owner.address)).to.eq(true);
        expect(await event.hasATicket(0, secondAccount.address)).to.eq(true);
        await expect(
          await event
            .connect(firstAccount)
            .buyTicket(0, { value: ethers.utils.parseEther("0.1") })
        )
          .to.emit(event, "UserEvents")
          .withArgs(firstAccount.address, 0, false)
          .to.emit(event, "TicketNumber")
          .withArgs(3);

        expect(await event.hasATicket(0, firstAccount.address)).to.eq(true);
      });
      it("The owner sends a free ticket", async function () {
        const { event, owner, firstAccount } = await loadFixture(
          deployEventsAndGetAccounts
        );

        await event.createEvent(
          100,
          ethers.utils.parseEther("0.1"),

          new Date("2024-01-01").getTime() / 1000
        );

        await expect(await event.giveTicket(0, firstAccount.address))
          .to.emit(event, "UserEvents")
          .withArgs(firstAccount.address, 0, false)
          .to.emit(event, "TicketNumber")
          .withArgs(2);

        expect(await event.hasATicket(0, firstAccount.address)).to.eq(true);
        expect(await event.hasATicket(0, owner.address)).to.eq(true);
      });
    });
    describe("Should revert the ticket transaction", function () {
      it("Not enough money", async function () {
        const { event, owner, firstAccount } = await loadFixture(
          deployEventsAndGetAccounts
        );

        await event.createEvent(
          100,
          ethers.utils.parseEther("1"),

          new Date("2024-01-01").getTime() / 1000
        );

        await expect(
          event
            .connect(firstAccount)
            .buyTicket(0, { value: ethers.utils.parseEther("0.99") })
        ).to.be.revertedWith("The payment is not enough");

        expect(
          await event.connect(firstAccount).hasATicket(0, firstAccount.address)
        ).to.eq(false);
      });
      describe("Should revert the ticket transaction", function () {
        it("User buying twice", async function () {
          const { event } = await loadFixture(deployEventsAndGetAccounts);

          await event.createEvent(
            100,
            ethers.utils.parseEther("0.1"),

            new Date("2024-01-01").getTime() / 1000
          );

          expect(
            event.buyTicket(0, { value: ethers.utils.parseEther("1.01") })
          );
          await expect(
            event.buyTicket(0, { value: ethers.utils.parseEther("1.01") })
          ).to.be.revertedWith("The user has a ticket");
        });

        it("Owner send ticket to a user with ticket", async function () {
          const { event, firstAccount, secondAccount } = await loadFixture(
            deployEventsAndGetAccounts
          );

          await event.createEvent(
            100,
            ethers.utils.parseEther("0.1"),

            new Date("2024-01-01").getTime() / 1000
          );

          expect(
            await event
              .connect(firstAccount)
              .buyTicket(0, { value: ethers.utils.parseEther("1.01") })
          );
          expect(
            await event.giveTicket(0, secondAccount.address)
          ).to.be.revertedWith("The user has a ticket");
        });

        it("The event is full", async function () {
          const { event, firstAccount, secondAccount } = await loadFixture(
            deployEventsAndGetAccounts
          );

          await event.createEvent(
            2,
            ethers.utils.parseEther("1"),

            new Date("2024-01-01").getTime() / 1000
          );

          expect(
            await event
              .connect(firstAccount)
              .buyTicket(0, { value: ethers.utils.parseEther("1.01") })
          );
          expect(event.giveTicket(0, secondAccount.address)).to.be.revertedWith(
            "Event is full"
          );
        });

        it("Invalid event", async function () {
          const { event } = await loadFixture(deployEventsAndGetAccounts);

          await event.createEvent(
            2,
            ethers.utils.parseEther("0.1"),

            new Date("2024-01-01").getTime() / 1000
          );

          await expect(event.buyTicket(55)).to.be.revertedWith(
            "Event doesn't exist"
          );
        });

        it("Event expired", async function () {
          const { event } = await loadFixture(deployEventsAndGetAccounts);

          await event.createEvent(
            2,
            ethers.utils.parseEther("1.01"),

            Math.floor(Date.now() / 1000) + 5
          );
          await new Promise((r) => setTimeout(r, 7000));
          await expect(
            event.buyTicket(0, { value: ethers.utils.parseEther("1.01") })
          ).to.be.revertedWith("Event expired");
        });
      });
    });
    describe("Withdraw the event income", function () {
      it("Withdraw", async function () {
        const { event, firstAccount, secondAccount } = await loadFixture(
          deployEventsAndGetAccounts
        );
        await event.createEvent(
          100,
          ethers.utils.parseEther("1"),

          new Date("2024-01-01").getTime() / 1000
        );

        await event
          .connect(firstAccount)
          .buyTicket(0, { value: ethers.utils.parseEther("1") });
        expect(await ethers.provider.getBalance(event.address)).to.eq(
          ethers.utils.parseEther("1")
        );
        await event
          .connect(secondAccount)
          .buyTicket(0, { value: ethers.utils.parseEther("2") });
        expect(await ethers.provider.getBalance(event.address)).to.eq(
          ethers.utils.parseEther("3")
        );

        // const oldOwnerBalance = await ethers.provider.getBalance(owner.address);
        const withdraw = await event.withdraw(0);
        // const receipt = await withdraw.wait()

        await expect(withdraw)
          .to.emit(event, "EventIncome")
          .withArgs(0, ethers.utils.parseEther("3"));

        //   const gasUsed = receipt.getTransactionReceipt().gasUsed
        // const newOwnerBalance = await ethers.provider.getBalance(owner.address);
        //   console.log(newOwnerBalance, oldOwnerBalance)
        // expect(oldOwnerBalance.add(ethers.utils.parseEther("3")).add(gasUsed) ).to.eq(
        //   newOwnerBalance
        // );
      });
    });
  });
});
