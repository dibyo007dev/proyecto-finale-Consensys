import { Connect, SimpleSigner } from "uport-connect";

export const uport = new Connect("Auction Protocol ", {
  clientId: "2okPMAaZ2hsAczEAZFvkUqNbfV5aR214exG",
  network: "rinkeby",
  signer: SimpleSigner(
    "caee31e2f9c90ee3e75e71d8503de9c3584dc4d6c8804fe30ac8f541a83fa1a9"
  )
});

export const web3 = uport.getWeb3();

// // Attest specific credentials
// uport.attestCredentials({
//   sub: THE_RECEIVING_UPORT_ADDRESS,
//   claim: {
//     CREDENTIAL_NAME: CREDENTIAL_VALUE
//   },
//   exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
// })
