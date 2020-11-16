const TokenMock = artifacts.require("TokenMock");
const Byx88Payment = artifacts.require("Byx88Payment");

module.exports = async function (deployer, network, accounts) {
  console.log(network);
  const [owner, payer] = accounts;

  if (network == "ganache") {
    await deployer.deploy(TokenMock, web3.utils.toWei("10000000", "mwei"));
    const tm = await TokenMock.deployed();
    await tm.transfer(payer, web3.utils.toWei("1000", "mwei"));
    await deployer.deploy(Byx88Payment, tm.address);
  } else if (network == "ropsten") {
    if (owner !== "0xBEF473cE6738d73df0351107CC6f9A087CA0d00a") return;
    await deployer.deploy(TokenMock, web3.utils.toWei("10000000", "mwei"));
    const tm = await TokenMock.deployed();
    await deployer.deploy(Byx88Payment, tm.address);
  } else {
    if (owner !== "0xBEF473cE6738d73df0351107CC6f9A087CA0d00a") return;
    // USDT - 0xdAC17F958D2ee523a2206206994597C13D831ec7
    const ERC20_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    await deployer.deploy(Byx88Payment, ERC20_ADDRESS);
  }
};
