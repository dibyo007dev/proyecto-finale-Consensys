var AucSters = artifacts.require("./AucSters.sol");
var SafeMath = artifacts.require("../libraries/SafeMath.sol");
var BiddingContract = artifacts.require("./BiddingContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, AucSters);
  deployer.link(SafeMath, BiddingContract);
  deployer.deploy(AucSters, 1000000).then(() => {
    //tokenPrice set to 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(BiddingContract, AucSters.address, tokenPrice);
  });
};
