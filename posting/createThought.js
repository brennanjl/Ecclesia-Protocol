import Arweave from 'arweave';
import {gateway} from "../gateway.js";
import {addPhoto} from './internal/addPhoto.js';
// import {devKey} from './devKey.js'; //This imports the devs personal key from a file in .gitignore, and will be replaced once the library is ready for use
const arweave = Arweave.init(gateway);

// const key = devKey

export var createThought = async (text, photo, privateKey) => {
 
  // If no photo, input 'none'
  // This won't work
  if (text.length > 300) {
    throw "Input must be less than 300";
  }
  if (photo != "none") {
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
  if (photo != "none") {
    _transaction.addTag("photoTXID", photoID);
  }
  await arweave.transactions.sign(_transaction, privateKey);

  let uploader = await arweave.transactions.getUploader(_transaction);

  const response = await arweave.transactions.post(_transaction);

  console.log(response.status);
};

//createThought2('What a cool post!', './Ecclesia Square No Back.png', key)