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
