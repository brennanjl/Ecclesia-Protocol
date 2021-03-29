import { all, fetchTxTag, run } from 'ar-gql';
import Arweave from "arweave";
import {publicKey} from './devKey.js' //not needed in final version, just for local testing purposes
import {gateway} from "./gateway.js";
import { getDataFromTXID } from './Internal/getDataFromTXID.js';
import { sortChronological } from './Internal/sortChronological.js';
const arweave = Arweave.init(gateway);

export const getThought = async(publicKey, numOfPosts) => {

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


console.log(sortedData[0].textData)
return sortedData[0].textData
}

getThought('Cf1cXx1wENt0XOA9wMoTWYB-rvP0jEdGS1gdQN7XkvQ', 1)