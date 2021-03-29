import Arweave from 'arweave';
import {gateway} from "./gateway.js";
import {devKey} from './devKey.js'; //This imports the devs personal key from a file in .gitignore, and will be replaced once the library is ready for use
import {addPhoto} from './internal/addPhoto.js';
const arweave = Arweave.init(gateway);

const key = devKey

export var createThinkPiece = async(text, photo, privateKey) => { //If no photo, then enter 'none'

if (photo != 'none'){
    var photoID = await addPhoto(photo, key)
    photoID = photoID.toString()
}
else {
    var photoID = 'none'
};
photoID = '"'+photoID+'"'

    if (typeof(text) != 'string') {
        throw 'Input must be a string!'
    };

    let postTime = Date.now()
    postTime = postTime.toString()//posted data must be in Uint8Array, ArrayBuffer, or string
    
    text = '"'+text+'"'

    postTime = '"'+postTime+'"'
    let _transaction = await arweave.createTransaction({
    data: '{"textData": '+text+', "timeStamp": '+postTime+', "photoTXID": '+photoID+'}',
    target: 'nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U',
    quantity: arweave.ar.arToWinston('0.0001')
}, key);


    _transaction.addTag('App-Name', 'Ecclesia');
    _transaction.addTag('version', '0.0.1');
    _transaction.addTag('Type', 'Thought');


    await arweave.transactions.sign(_transaction, key);
    
    let uploader = await arweave.transactions.getUploader(_transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

}
