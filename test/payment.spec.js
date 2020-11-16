/**
 * @author Billy Editiano
 */

const chai = require("chai");
chai.use(require("chai-as-promised"));
const expect = chai.expect;

/** Load Contracts */
const Token = artifacts.require("TokenMock");
const ByxPayment = artifacts.require("Byx88Payment");

contract("ByxPayment", accounts => {
  /** ERC20 Token Representation */
  let token;

  /** Byx88Payment */
  let payment;

  /** Instantiate Contracts */
  beforeEach(async () => {
    token = await Token.new("1000000000000000000000");
    payment = await ByxPayment.new(token.address);

    // give accounts[1] 1000000000 balance of token
    await token.transfer(accounts[1], "1000000000", { from: accounts[0] });
    await token.transfer(payment.address, "10000000000", { from: accounts[0] });
  });

  /** Deposit */
  describe("Deposit", () => {
    it("should transfer from payer to byx", async () => {
      /**
       * Scenario:
       * 1. Payer approve ERC20 with a certain amount.
       * 2. Front-end triggers Backend via HTTP API to execute transferFrom (happens outside the contract)
       * 3. Backend execute transferFrom (deposit method)
       * 4. Insert deposit data to database (happens outside the contract)
       */

      /** Byx88Payment Contract address */
      const paymentAddress = payment.address;

      const [owner, payer] = accounts;

      // 500000000 = 500 (6 decimals)
      const depositAmount = "500000000";

      // check balances
      const contractBalance = (await token.balanceOf(paymentAddress)).toString();
      const payerBalance = (await token.balanceOf(payer)).toString();

      // initial balance
      expect(payerBalance).to.equal("1000000000");
      const expectedContractBalance = "10000000000";
      expect(contractBalance).to.equal(expectedContractBalance);

      // 1. Payer approve ERC20 with a certain amount.
      const approveRes = await token.approve(paymentAddress, depositAmount, { from: payer });

      // 3. Backend execute transferFrom
      const transferFromRes = await payment.deposit(payer, depositAmount, { from: owner });

      // check balances
      const contractBalanceUpdated = (await token.balanceOf(paymentAddress)).toString();
      const payerBalanceUpdated = (await token.balanceOf(payer)).toString();
      // updated balance
      const expectedPayerUpdatedBalance = web3.utils.toBN("1000000000").sub(web3.utils.toBN(depositAmount)).toString();
      expect(payerBalanceUpdated).to.equal(expectedPayerUpdatedBalance);
      const expectedContractUpdatedBalance = web3.utils.toBN(expectedContractBalance).add(web3.utils.toBN(depositAmount)).toString();
      expect(contractBalanceUpdated).to.equal(expectedContractUpdatedBalance);
    });
  });

  /** Withdrawal */
  describe("Withdrawal", () => {
    it("should transfer balance from contract to user", async () => {
      /**
       * Scenario:
       * 1. Player initiate withdraw request (happens outside the contract)
       * 2. System verify the request (happens outside the contract)
       * 3. Backend execute withdraw
       */

      /** Byx88Payment Contract address */
      const paymentAddress = payment.address;

      const [owner, payer] = accounts;

      // 500000000 = 500 (6 decimals)
      const withdrawAmount = "500000000";

      // check balances
      const contractBalance = (await token.balanceOf(paymentAddress)).toString();
      const payerBalance = (await token.balanceOf(payer)).toString();

      // initial balance
      expect(payerBalance).to.equal("1000000000");
      const expectedContractBalance = "10000000000";
      expect(contractBalance).to.equal(expectedContractBalance);

      const withdrawResp = await payment.withdraw(1, payer, withdrawAmount, { from: owner });

      // check balances
      const contractBalanceUpdated = (await token.balanceOf(paymentAddress)).toString();
      const payerBalanceUpdated = (await token.balanceOf(payer)).toString();

      // updated balance
      const expectedPayerUpdatedBalance = web3.utils.toBN("1000000000").add(web3.utils.toBN(withdrawAmount)).toString();
      expect(payerBalanceUpdated).to.equal(expectedPayerUpdatedBalance);
      const expectedContractUpdatedBalance = web3.utils.toBN(expectedContractBalance).sub(web3.utils.toBN(withdrawAmount)).toString();
      expect(contractBalanceUpdated).to.equal(expectedContractUpdatedBalance);
    });
  });

  /** Transfer Ownership */
  describe("Transfer Ownership", () => {
    it("should transfers the ownership", async () => {
      const [oldOwner, newOwner, dummyAccount] = accounts;
      const contractOwner = await payment.owner();

      expect(contractOwner).to.equal(oldOwner);

      // transfer to new Owner
      const transferOwnershipRes = await payment.transferOwnership(newOwner, { from: oldOwner });

      const updatedContractOwner = await payment.owner();
      expect(updatedContractOwner).to.equal(newOwner);

      async function testWithdrawNew() {
        await payment.withdraw(1, dummyAccount, "1000000", { from: newOwner });
      }

      async function testWithdrawOld() {
        await payment.withdraw(1, dummyAccount, "1000000", { from: oldOwner });
      }

      await expect(testWithdrawNew()).to.eventually.be.fulfilled;
      await expect(testWithdrawOld()).to.eventually.be.rejected;
    });
  });
});