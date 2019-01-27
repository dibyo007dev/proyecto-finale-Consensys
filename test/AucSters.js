var AucSters = artifacts.require("../contracts/AucSters.sol");

contract("AucSters", function(accounts) {
  it("initializes the name symbol and standard", () => {
    return AucSters.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.name();
      })
      .then(name => {
        assert.equal(name, "AucSters", "Sets name correctly");
        return tokenInstance.symbol();
      })
      .then(symbol => {
        assert.equal(symbol, "ASS", "Sets the symbol to ASS");
        return tokenInstance.standard();
      })
      .then(standard => {
        assert.equal(standard, "AucSters v0.1", "Standards set correctly");
      });
  });

  it("allocates the total supply upon deployment", function() {
    return AucSters.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      })
      .then(totalSupply => {
        assert.equal(
          totalSupply.toNumber(),
          1000000,
          "sets totalSupply to 1000000"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(adminBalance => {
        assert.equal(
          adminBalance.toNumber(),
          1000000,
          "allocates the totalSupply to the admin when deployed"
        );
      });
  });

  it("transfers the ownership of token", () => {
    return AucSters.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.transfer.call(accounts[1], 9999999999999);
      })
      .then(assert.fail)
      .catch(err => {
        //console.log(err);
        assert(
          err.message.indexOf("revert") >= 0,
          "error msg must contain revert"
        );
        return tokenInstance.transfer.call(accounts[1], 250000, {
          from: accounts[0]
        });
      })
      .then(success => {
        assert.equal(success, true, "trasfer function returns true");

        return tokenInstance.transfer(accounts[1], 250000, {
          from: accounts[0]
        });
      })
      .then(reciept => {
        //console.log(reciept);
        assert.equal(reciept.logs.length, 1, "only one event must trigger");
        assert.equal(
          reciept.logs[0].event,
          "Transfer",
          "Transfer event must trigger"
        );
        assert.equal(
          reciept.logs[0].args._from,
          accounts[0],
          "debited from account[0]"
        );
        assert.equal(
          reciept.logs[0].args._to,
          accounts[1],
          "Added to recipients address"
        );
        assert.equal(
          reciept.logs[0].args._value,
          250000,
          "debited from account[0]"
        );

        return tokenInstance.balanceOf(accounts[1]);
      })
      .then(balance => {
        assert.equal(
          balance.toNumber(),
          250000,
          "adds the amount to the recipients account"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(balance => {
        assert.equal(
          balance.toNumber(),
          750000,
          "balance remaining should be checked"
        );
      });
  });

  it("approves tokens for delegated transfer", () => {
    return AucSters.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.approve.call(accounts[1], 100);
      })
      .then(success => {
        assert.equal(success, true, "Approval of transaction successfull");
        return tokenInstance.approve(accounts[1], 100);
      })
      .then(reciept => {
        assert.equal(reciept.logs.length, 1, "only one event must trigger");
        assert.equal(
          reciept.logs[0].event,
          "Approval",
          "Approval event must trigger"
        );
        assert.equal(
          reciept.logs[0].args._owner,
          accounts[0],
          "Account whose tokens are being transfered"
        );
        assert.equal(
          reciept.logs[0].args._spender,
          accounts[1],
          "Spender who got the approval for spending token"
        );
        assert.equal(
          reciept.logs[0].args._value,
          100,
          "Tokens approved for the delegated transfer"
        );
        return tokenInstance.allowance(accounts[0], accounts[1]);
      })
      .then(allowance => {
        assert.equal(
          allowance,
          100,
          "stores the allowance for delegated transfer"
        );
      });
  });

  it("handles the transferFrom", () => {
    return AucSters.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.approve.call(accounts[2], 100, {
          from: accounts[0]
        });
      })
      .then(success => {
        assert.equal(success, true, "account[2] approved for transaction");
        return tokenInstance.approve(accounts[2], 100, { from: accounts[0] });
      })
      .then(reciept => {
        assert.equal(reciept.logs.length, 1, "only one event must trigger");
        assert.equal(
          reciept.logs[0].event,
          "Approval",
          "Approval event must trigger"
        );
        assert.equal(
          reciept.logs[0].args._owner,
          accounts[0],
          "Account whose tokens are being transfered"
        );
        assert.equal(
          reciept.logs[0].args._spender,
          accounts[2],
          "Spender who got the approval for spending token"
        );
        assert.equal(
          reciept.logs[0].args._value,
          100,
          "Tokens approved for the delegated transfer"
        );
        return tokenInstance.allowance(accounts[0], accounts[2]);
      })
      .then(allowance => {
        assert.equal(allowance, 100, " allowance updated before transaction");
        return tokenInstance.transferFrom.call(accounts[0], accounts[2], 50, {
          from: accounts[1]
        });
      })
      .then(success => {
        assert.equal(success, true, " transfer successfull");
        return tokenInstance.transferFrom(accounts[0], accounts[1], 50, {
          from: accounts[2]
        });
      })
      .then(reciept => {
        assert.equal(reciept.logs.length, 1, "only one event must trigger");
        assert.equal(
          reciept.logs[0].event,
          "Transfer",
          "Transfer event must trigger"
        );
        assert.equal(
          reciept.logs[0].args._from,
          accounts[0],
          "debited from account[0]"
        );
        assert.equal(
          reciept.logs[0].args._to,
          accounts[1],
          "Added to recipients address"
        );
        assert.equal(
          reciept.logs[0].args._value,
          50,
          "debited from account[0]"
        );
        return tokenInstance.allowance(accounts[0], accounts[2]);
      })
      .then(allowance => {
        assert.equal(
          allowance,
          50,
          " allowance updated before from transaction"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 749950, "_from balance updated");
        return tokenInstance.balanceOf(accounts[1]);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 250050, "_to balance updated");
      });
  });
});
