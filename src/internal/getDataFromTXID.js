import axios from 'axios';

var getDataFromTXID = async(TXID) => {
    const postData = await axios.get(
        "https://arweave.net/"+TXID
        )
return postData
}

export var getDataFromTXID