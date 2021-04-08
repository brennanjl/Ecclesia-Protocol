import Arweave from "arweave";
import { gateway } from "../gateway.js";
import fs from "fs";
const arweave = Arweave.init(gateway);

var addPhoto = async (photo, privateKey) => {
  let key = privateKey;

  let data = fs.readFileSync(photo);

  let _transaction = await arweave.createTransaction(
    {
      data: data,

      target: "nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U",

      quantity: arweave.ar.arToWinston("0.0001"),
    },
    key
  );

  _transaction.addTag("App-Name", "Ecclesia");
  _transaction.addTag("version", "0.0.1");
  _transaction.addTag("Type", "Photo");

  await arweave.transactions.sign(_transaction, key);

  let uploader = await arweave.transactions.getUploader(_transaction);

  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    );
  }
  return _transaction.id;
};

export var addPhoto;
