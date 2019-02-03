### DeAuction (2018-2019 Developer Program Final Project)

My name is Dibyo Majumder and you can reach me at dibyomajumder23@gmail.com

This application allows any user holding "AucSters" tokens to bid simultaniously on any product in an Auction. Different registered seller has the ability to post a product for an Auction and which wll be displayed in the Users Console. Any user can bid on any product popping up. Once the auction session is done, top most bid is finalized and exchange of token is handled .

FUTURE PLANS : Everything in the Token Transferring phase will be handled by a Supply Chain.

## FrontEnd Published in IPFS:

Visit the link below :
https://gateway.ipfs.io/ipfs/QmVRsS1cKv4Ryzg2k9KvmuTzitZJH9zaq1tZrni6Y79EkT

In case it doesn't work feel free to contract

## Setting up

This application is based in truffle box [react-uport](https://truffleframework.com/boxes/react-uport).

You need to have nodejs, truffle and your OS build essential tools installed.

It was tested using Metamask chrome extension.

Prerequisites: Uport Application to be installed in your Smartphone

Clone project:

```
$ git clone https://github.com/dibyo007dev/proyecto-finale-Consensys.git
$ cd proyecto-finale-Consensys/
```

Check `truffle.js` file for settings. It contains basic configuration to connect to a local instance of ganache.

Run ganache:

`$ ganache-cli`

Compile and migrate:

`$ truffle compile`
`$ truffle migrate`

Run tests:

`$ truffle test`

Download the dependencies :

`$ npm install`

To start the app :

`$ npm run start`

Now a Browser window will popup and You can Login to the APP with Uport

## Interaction Initial Setup :

First it is needed to move some ASS tokens from the admin to the Bidding Contract which will further faclitates the token buying and further Bidding.

### Checklist (For ease of reviewer)

- [x] Project includes a README.md that explains the project.
- [x] The project is a Truffle project that allows you to easily compile, migrate and test the provided Solidity contracts.
- [x] Project is commented as outline in the documentation.
- [x] At least one contract uses a library or inherits from another contract - Actually 3.
- [x] I can run the app on a dev server locally for testing/grading (connecting to Rinkeby if required).
- [x] I can visit a URL and interact with the app (can be localhost).
- [x] The app displays the current ethereum account.
- [ ] I can sign transactions using Metamask (or uPort).
- [x] The app interface reflects updates to to the contract state.
- [x] 7 tests written in Javascript or Solidity (or both).
- [x] Tests are explained with brief code comments.
- [x] Tests are properly structured.
- [x] All tests pass 🎉.
- [x] At least one of the contracts implements a circuit breaker / emergency stop pattern.
- [x] Project includes a file called [design_pattern_desicions.md](design_pattern_desicions.md) that explains some of the design decisions made by the author.
- [x] [design_pattern_desicions.md](design_pattern_desicions.md) adequately describes the design patterns implemented in the project.
- [x] Project includes a file called [avoiding_common_attacks.md](avoiding_common_attacks.md) that explains what measures you took to ensure that your contracts are not susceptible to common attacks.
- [x] The [avoiding_common_attacks.md](avoiding_common_attacks.md) covers at least 3 common attacks and how the app mitigates user risk.
- [x] Project includes a file called [deployed_addresses.txt](deployed_addresses.txt) that describes where the deployed testnet contracts live (which testnet and address).
- [x] **Project uses IPFS** to host the front-end files in the ipfs gateway .
- [ ] The project uses and upgradable design pattern for the smart contracts.
- [ ] At least one contract is written in Vyper or LLL.
- [x] The app uses uPort for user authentication and/or signing and sending transactions.
- [ ] The app uses the Ethereum Name Service to resolve human readable names to Ethereum addresses (in progress).
- [ ] The project uses an Oracle service such as Oraclize.

### ToDo

- [ ] Add 404 for trash URLs.
- [ ] Better UI dev.
- [ ] Adding the supply chain for making it a DAO.
- [ ] Withdraw the tokens whenever wanted.
- [ ] Product Details .
- [ ] Uport Transaction Processing.
- [ ] Oraclize the supply chain
