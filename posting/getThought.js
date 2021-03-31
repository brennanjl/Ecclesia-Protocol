import { all, fetchTxTag, run } from 'ar-gql';
import Arweave from "arweave";
import {gateway} from "./gateway.js";
import { sortChronological } from './internal/sortChronological.js';
const arweave = Arweave.init(gateway);

export var getThought = async(publicKey, numOfPosts) => {
    if (typeof publicKey != 'string') {
        throw "Public Key must be a string"
    }
    if (typeof numOfPosts != 'number') {
        throw "Number of posts must be an integer"
    }

    const getID = ( await run(`query($cursor: String) {
        transactions(owners:["`+publicKey+`"]
        recipients:["nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U"]
        first: `+numOfPosts+`
        sort: HEIGHT_DESC,
          tags: [
            { name: "App-Name", values: ["Ecclesia"] }
            { name: "Type", values: ["Thought"] }
            { name: "version", values: ["0.0.1"] }
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
                tags{
                    name
                    value
                    }
              owner {
                address
                     }
                }
            }
        }
      }`
    )
    )
    const postList = []
      for (let post in getID.data.transactions.edges) {
        if (typeof getID.data.transactions.edges[post].node.tags[5] != 'undefined') {
        postList.push({"thought": getID.data.transactions.edges[post].node.tags[4].value, "timeStamp": getID.data.transactions.edges[post].node.tags[3].value, "photoTXID": getID.data.transactions.edges[post].node.tags[5].value, "postTXID": getID.data.transactions.edges[post].node.id})
        }
      }

        let sortedPostList = await sortChronological(postList, numOfPosts)
      console.log(sortedPostList)
      return sortedPostList

}

//getThought('Cf1cXx1wENt0XOA9wMoTWYB-rvP0jEdGS1gdQN7XkvQ', 50)