import { all, fetchTxTag, run } from 'ar-gql';
import Arweave from "arweave";
import axios from 'axios';
import {publicKey} from './devKey.js' //not needed in final version, just for local testing purposes
import {gateway} from "./gateway.js";
const arweave = Arweave.init(gateway);

export const getPost = async(publicKey, numOfPosts) => {

if (typeof numOfPosts != 'number') {
    throw 'Number of posts queried must be an integer'
};

if (Math.ceil(numOfPosts) != numOfPosts) {
    throw 'Number of posts queried must be an integer'
};

if (numOfPosts < 1) {
    throw 'Number of posts queried must be greater than 0'
};

if (typeof publicKey != 'string') {
    throw 'Invalid Public Key: Key must be a string'
};

if (publicKey.length != 43) {
    throw 'Invalid Public Key: Key must be 43 characters long'
};

const getID = ( await run(`query($cursor: String) {
    transactions(owners:["`+publicKey+`"]
    recipients:["nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U"]
    first: `+numOfPosts+`
    sort: HEIGHT_DESC,
      tags: [
        { name: "App-Name", values: ["Ecclesia"] }
        { name: "Type", values: ["post"] }
      ]
      after: $cursor
    ) 
    {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
            id
          owner {
            address
          }
          tags {
              name
              value
          }
        }
      }
    }
  }`
)
);

let postMetadata = getID.data.transactions.edges

const returnedData = []
for (let i in postMetadata) {

    const postData = await axios.get(
        "https://arweave.net/"+postMetadata[i].node.id
        )
    returnedData.push(postData.data)
}

let sortedData = []

if (numOfPosts > 1) {
for (let i in returnedData) {
    if (sortedData.length == 0) {
        sortedData.push(returnedData[i])
    }
    else {
        for (let j in sortedData){
            if (returnedData[i].timeStamp <= sortedData[j].timeStamp) {
                sortedData.unshift(returnedData[i])
                break;
            }
            else if (j == sortedData.length-1) {
                sortedData.push(returnedData[i])
            }
        }
    }

}
}


console.log(sortedData)
return sortedData
}