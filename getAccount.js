import { all, fetchTxTag, run } from 'ar-gql';
import Arweave from "arweave";
import axios from 'axios';
import {devKey} from './devKey.js' //not needed in final version, just for local testing purposes
import {gateway} from "./gateway.js";
const arweave = Arweave.init(gateway);

const address = await arweave.wallets.jwkToAddress(devKey)

export var getAccount = async(address) => {
    if (typeof address != 'string') {
        throw 'Invalid Public Key: Key must be a string'
    };
    
    if (address.length != 43) {
        throw 'Invalid Public Key: Key must be 43 characters long'
    };

    const getAccountTXID = ( await run(`query($cursor: String) {
        transactions(owners:["`+address+`"]
        recipients:["nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U"]
        first: 2
        sort: HEIGHT_DESC,
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
            }
          }
        }
      }`
    )
    );

let accountMetadata = getAccountTXID.data.transactions.edges

const returnedData = []
for (let i in accountMetadata) {
    const postData = await axios.get(
        "https://arweave.net/"+accountMetadata[i].node.id     )
    returnedData.push(postData.data)
}
const sortedData = []

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
        console.log(sortedData[0])
        return sortedData[0]
}
}
//getAccount('Cf1cXx1wENt0XOA9wMoTWYB-rvP0jEdGS1gdQN7XkvQ')