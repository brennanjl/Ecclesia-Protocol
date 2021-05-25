import Arweave from "arweave";
import { gateway } from "../gateway.js";
import { addPhoto } from "../Internal/addPhoto.js";
const arweave = Arweave.init(gateway);

export var createThought = async (text, photo, privateKey) => {
  try {
    // If no photo, input 'none'
    if (typeof text !== "string" || text.length > 300) {
      throw "Input must be less than 300";
    }

    if (photo) {
      var photoID = await addPhoto(photo, privateKey);
      photoID = photoID.toString();
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
    _transaction.addTag("Type", "Thought");
    _transaction.addTag("Time", postTime);
    _transaction.addTag("Post-Text", text);

    if (photo) {
      _transaction.addTag("photoTXID", photoID);
    }

    await arweave.transactions.sign(_transaction, privateKey);

    return arweave.transactions.post(_transaction);
  } catch (error) {
    console.error(error);
  }
};
