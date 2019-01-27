var BiddingContract = artifacts.require("./BiddingContract.sol");
var AucSters = artifacts.require("../contracts/AucSters.sol");

contract("BiddingContract", accounts => {
  var tokenInstance;
  var biddingInstance;
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokenPrice = 1000000000000000; // in wei
  var tokensAvailable = 750000;
  var numberOfTokens;

  it("initializes the token with correct values", () => {
    return BiddingContract.deployed()
      .then(instance => {
        biddingInstance = instance;
        return biddingInstance.address;
      })
      .then(address => {
        assert.notEqual(address, 0x0, "deployed contract has an address");
        return biddingInstance.tokenContract();
      })
      .then(address => {
        assert.notEqual(address, 0x0, "has token contract address");
        return biddingInstance.tokenPrice();
      })
      .then(price => {
        assert.equal(price, tokenPrice, "correct price is set");
      });
  });

  it("facilitates token buying", () => {
    return AucSters.deployed()
      .then(instance => {
        // Grab token instance first
        tokenInstance = instance;
        return BiddingContract.deployed();
      })
      .then(instance => {
        // Then grab token sale instance
        biddingInstance = instance;
        // Provision 75% of all tokens to the token sale
        return tokenInstance.transfer(
          biddingInstance.address,
          tokensAvailable,
          { from: admin }
        );
      })
      .then(receipt => {
        numberOfTokens = 10;
        return biddingInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: numberOfTokens * tokenPrice
        });
      })
      .then(receipt => {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "TokenSold",
          'should be the "TokenSold" event'
        );
        assert.equal(
          receipt.logs[0].args._buyer,
          buyer,
          "logs the account that purchased the tokens"
        );
        assert.equal(
          receipt.logs[0].args._amount,
          numberOfTokens,
          "logs the number of tokens purchased"
        );
        return biddingInstance.tokensSold();
      })
      .then(amount => {
        assert.equal(
          amount.toNumber(),
          numberOfTokens,
          "increments the number of tokens sold"
        );
        return tokenInstance.balanceOf(buyer);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), numberOfTokens);
        return tokenInstance.balanceOf(biddingInstance.address);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
        // Try to buy tokens different from the ether value
        return biddingInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: 1
        });
      })
      .then(assert.fail)
      .catch(error => {
        assert(
          error.message.indexOf("revert") >= 0,
          "msg.value must equal number of tokens in wei"
        );
        return biddingInstance.buyTokens(800000, {
          from: buyer,
          value: numberOfTokens * tokenPrice
        });
      })
      .then(assert.fail)
      .catch(error => {
        // assert(
        //   error.message.indexOf("revert") >= 0,
        //   "cannot purchase more tokens than available"
        // );
      });
  });

  it("ends token selling for Bidding contract", function() {
    return AucSters.deployed()
      .then(function(instance) {
        // Grab token instance first
        tokenInstance = instance;
        return BiddingContract.deployed();
      })
      .then(function(instance) {
        // Then grab token supply instance
        biddingInstance = instance;
        // Try to end supply from account other than the admin
        return biddingInstance.endSupply({ from: buyer });
      })
      .then(assert.fail)
      .catch(error => {
        assert(
          error.message.indexOf("revert") >= 0,
          "must be admin to end supply"
        );
        // End supply as admin
        return biddingInstance.endSupply({ from: admin });
      })
      .then(function(receipt) {
        return tokenInstance.balanceOf(admin);
      })
      .then(function(balance) {
        assert.equal(
          balance.toNumber(),
          999990,
          "returns all unsold  aucSter tokens to admin"
        );
        // Check that the contract has no balance
        return tokenInstance.balanceOf(biddingInstance.address);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 0);
      });
  });

  it("facilitates the product adding in an auction", () => {
    AucSters.deployed()
      .then(instance => {
        tokenInstance = instance;
        return BiddingContract.deployed();
      })
      .then(instance => {
        biddingInstance = instance;

        return tokenInstance.transfer(
          biddingInstance.address,
          tokensAvailable,
          { from: admin }
        );
      })
      .then(receipt => {
        return biddingInstance.registerSeller(seller, "seller1", 111, {
          from: accounts[3]
        });
      })
      .then(assert.fail)
      .catch(error => {
        assert(
          error.message.indexOf("revert") > 0,
          "only admin can add a seller"
        );
        return;
      });
  });
});
