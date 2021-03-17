import Arweave from 'arweave';
import {gateway} from "./gateway.js";
import { all, fetchTxTag, run } from 'ar-gql';
import axios from 'axios';
import {devKey} from './devKey.js'; //This imports the devs personal key from a file in .gitignore, and will be replaced once the library is ready for use
const arweave = Arweave.init(gateway);
const address = await arweave.wallets.jwkToAddress(devKey)

const key = devKey

const createAccount = async(name, biography, address) => {
    
    if (typeof address != 'string') {
        throw 'Invalid Public Key: Key must be a string'
    };
    
    if (address.length != 43) {
        throw 'Invalid Public Key: Key must be 43 characters long'
    };

    if (typeof biography != 'string') {
        throw 'Biography must be a string'
    }

    if (typeof name != 'string') {
        throw 'Name must be a string'
    }

    const checkIfRegistered = ( await run(`query($cursor: String) {
        transactions(owners:["`+address+`"]
        recipients:["nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U"]
          tags: [
            { name: "App-Name", values: ["Ecclesia"] }
            { name: "Type", values: ["Account-Registration"] }
          ]
          after: $cursor
        ) 
        {
          edges {
            cursor
            node {
                id
              owner {
                address
              }
            }
          }
        }
      }`
    ))
if (checkIfRegistered.data.transactions.edges != '') {
    throw 'User is already registered'
}

let postTime = Date.now()
    postTime = postTime.toString()
    name = '"'+name+'"';
    biography = '"'+biography+'"'
    address = '"'+address+'"'
    postTime = '"'+postTime+'"'
    let _transaction = await arweave.createTransaction({
    data: '{"name": '+name+', "biography": '+biography+', "address":'+address+', "timeStamp": '+postTime+'}',
    target: 'nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U',
    quantity: arweave.ar.arToWinston('0.0001')
}, key);


    _transaction.addTag('App-Name', 'Ecclesia');
    _transaction.addTag('Type', 'Account-Registration');

    await arweave.transactions.sign(_transaction, key);
    
    let uploader = await arweave.transactions.getUploader(_transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

}
