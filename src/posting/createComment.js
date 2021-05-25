import Arweave from "arweave";
import { gateway } from "../gateway.js";
const arweave = Arweave.init(gateway);

export var createComment = async (text, mainPostTXID, privateKey) => {
  if (text.length > 300) {
    throw "Input must be less than 300";
  }

  let postTime = Date.now();
  postTime = postTime.toString(); //posted data must be in Uint8Array, ArrayBuffer, or string

  let _transaction = await arweave.createTransaction(
    {
      target: "nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U",
      quantity: arweave.ar.arToWinston("0.0001"),
    },
    privateKey
  );

  _transaction.addTag("App-Name", "Ecclesia");
  _transaction.addTag("version", "0.0.1");
  _transaction.addTag("Type", "Comment");
  _transaction.addTag("Main-Post", mainPostTXID);
  _transaction.addTag("timeStamp", postTime);
  _transaction.addTag("Comment-Text", text);

  await arweave.transactions.sign(_transaction, privateKey);

  const response = await arweave.transactions.post(_transaction);

  console.log(response.status);
};
