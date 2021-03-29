import { all, fetchTxTag, run } from 'ar-gql';
import Arweave from "arweave";
import {gateway} from "./gateway.js";
import { getDataFromTXID } from './getDataFromTXID.js';
import { sortChronological } from './internal/sortChronological.js';
const arweave = Arweave.init(gateway);

export var getThought = async(publicKey, numOfPosts) => {

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
        { name: "Type", values: ["Thought"] }
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
        }
      }
    }
  }`
)
);

let postMetaData = getID.data.transactions.edges

const postData = await getDataFromTXID(postMetaData)

const sortedData = await sortChronological(postData, numOfPosts)


console.log(sortedData)
return sortedData
}
