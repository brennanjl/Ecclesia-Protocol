import Arweave from 'arweave';
import {gateway} from "../gateway.js";
import {devKey} from '../devKey.js'; //This imports the devs personal key from a file in .gitignore, and will be replaced once the library is ready for use
import { getFollowing } from './getFollowing.js';
const arweave = Arweave.init(gateway);

const key = devKey

export var follow = async(othersPublicID, privateKey) => {

    const pubKey = await arweave.wallets.jwkToAddress(privateKey)

    let postTime = Date.now()
    postTime = postTime.toString()//posted data must be in Uint8Array, ArrayBuffer, or string

    //Adding New Follower Here
    const followerList = await getFollowing(pubKey)
    
    if (followerList.followers.includes(othersPublicID)){
        throw 'User already follows this ID'
    }
    followerList.followers.push(othersPublicID)
    console.log(followerList)

    let _transaction = await arweave.createTransaction({
        data: JSON.stringify(followerList),
        target: 'nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U',
        quantity: arweave.ar.arToWinston('0.0001')
    }, privateKey);

_transaction.addTag('App-Name', 'Ecclesia');
_transaction.addTag('version', '0.0.1');
_transaction.addTag('Type', 'Follow');
_transaction.addTag('Person-Followed', othersPublicID);
_transaction.addTag('timeStamp', postTime);

await arweave.transactions.sign(_transaction, privateKey);

let uploader = await arweave.transactions.getUploader(_transaction);

while (!uploader.isComplete) {
  await uploader.uploadChunk();
  console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
}
}

//follow('nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U', key)