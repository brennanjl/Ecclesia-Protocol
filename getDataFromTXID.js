import axios from 'axios';

var getDataFromTXID = async(metadata) => {

const returnedData = []
for (let i in metadata) {

    const postData = await axios.get(
        "https://arweave.net/"+metadata[i].node.id
        )
    returnedData.push(postData.data)
}
return returnedData
}

export var getDataFromTXID