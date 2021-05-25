import Arweave from 'arweave';
import {gateway} from "../gateway.js";
import { all, fetchTxTag, run } from 'ar-gql';
import axios from 'axios';
//import {devKey} from '../devKey.js'; //This imports the devs personal key from a file in .gitignore, and will be replaced once the library is ready for use
//const _devKey = devKey
import { createFollowerList } from './internal/createFollowerList.js';
const arweave = Arweave.init(gateway);


//Create account will now be used for updating accounts.  This is to increase the efficiency of getAccount(), as this allows updating of accounts with one less call to the gateway
export var createAccount = async(name, biography, privateKey) => {
    const pubKey = await arweave.wallets.jwkToAddress(privateKey)

    if (typeof biography != 'string') {
        throw 'Biography must be a string'
    }

    if (typeof name != 'string') {
        throw 'Name must be a string'
    }

createFollowerList(privateKey)

let postTime = Date.now()
    postTime = postTime.toString()
    name = '"'+name+'"';
    biography = '"'+biography+'"'
    let _transaction = await arweave.createTransaction({
    data: '{"name": '+name+', "biography": '+biography+', "address":"'+pubKey+'", "pfpTXID": "none"}',
    target: 'nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U',
    quantity: arweave.ar.arToWinston('0.0001')
}, privateKey);


    _transaction.addTag('App-Name', 'Ecclesia');
    _transaction.addTag('Type', 'Account-Registration');
    _transaction.addTag('version', '0.0.1');
    _transaction.addTag('timeStamp', postTime);

    await arweave.transactions.sign(_transaction, privateKey);
    
    let uploader = await arweave.transactions.getUploader(_transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

}

//createAccount('Brennan Lamey', 'Ecclesia Founder, Free Speech Enthusiast, I kind of suck at coding', key)