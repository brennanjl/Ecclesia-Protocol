import Arweave from 'arweave';
import {gateway} from "../../gateway.js";
const arweave = Arweave.init(gateway);

export var createFollowerList = async(privateKey) => {
    let postTime = Date.now()
    postTime = postTime.toString()//posted data must be in Uint8Array, ArrayBuffer, or string

    const followList = {"followers": []}

    let _transaction = await arweave.createTransaction({
        data: JSON.stringify(followList),
        target: 'nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U',
        quantity: arweave.ar.arToWinston('0.0001')
    }, privateKey);

_transaction.addTag('App-Name', 'Ecclesia');
_transaction.addTag('version', '0.0.1');
_transaction.addTag('Type', 'Follow');
_transaction.addTag('Person-Followed', 'Initial-Creation');
_transaction.addTag('timeStamp', postTime);

await arweave.transactions.sign(_transaction, privateKey);

let uploader = await arweave.transactions.getUploader(_transaction);

while (!uploader.isComplete) {
  await uploader.uploadChunk();
  console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
}
}
