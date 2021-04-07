import Arweave from "arweave";
import { gateway } from "../gateway.js";
import { addPhoto } from "../Internal/addPhoto.js";
import { all, fetchTxTag, run } from "ar-gql";
import axios from "axios";
import { sortChronological } from "../Internal/sortChronological.js";
import { getDataFromTXID } from "../Internal/getDataFromTXID";

const arweave = Arweave.init(gateway);

export var createPFP = async (photo, privateKey) => {
  const pubKey = await arweave.wallets.jwkToAddress(privateKey);

  const checkIfRegistered = await run(
    `query($cursor: String) {
        transactions(owners:["` +
      pubKey +
      `"]
        recipients:["nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U"]
        first: 2
        sort: HEIGHT_DESC
          tags: [
            { name: "App-Name", values: ["Ecclesia"] }
            { name: "Type", values: ["Account-Registration"] }
            { name: "version", values: ["0.0.1"] }
          ]
          after: $cursor
        ) 
        {
          edges {
            cursor
            node {
                id
                tags{
                    name
                    value
                }
              owner {
                address
              }
            }
          }
        }
      }`
  );
  if (checkIfRegistered.data.transactions.edges == "") {
    throw "User is not registered";
  }

  const postList = [];
  for (let post in checkIfRegistered.data.transactions.edges) {
    postList.push({
      timeStamp:
        checkIfRegistered.data.transactions.edges[post].node.tags[3].value,
      TXID: checkIfRegistered.data.transactions.edges[post].node.id,
    });
  }

  const sortedAccountMetaData = await sortChronological(postList, 2);

  console.log(sortedAccountMetaData[0]);

  let accountData = await getDataFromTXID(sortedAccountMetaData[0].TXID);

  accountData = accountData.data;

  accountData.pfpTXID = await addPhoto(photo, privateKey);

  let postTime = Date.now();
  postTime = postTime.toString(); //posted data must be in Uint8Array, ArrayBuffer, or string

  let _transaction = await arweave.createTransaction(
    {
      data: JSON.stringify(accountData),
      target: "nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U",
      quantity: arweave.ar.arToWinston("0.0001"),
    },
    privateKey
  );

  _transaction.addTag("App-Name", "Ecclesia");
  _transaction.addTag("Type", "Account-Registration");
  _transaction.addTag("version", "0.0.1");
  _transaction.addTag("timeStamp", postTime);

  await arweave.transactions.sign(_transaction, privateKey);

  let uploader = await arweave.transactions.getUploader(_transaction);

  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    );
  }
  console.log(accountData);
};
//createPFP('./Ecclesia Square No Back.png', key)
