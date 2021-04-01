import { all, fetchTxTag, run } from 'ar-gql';
import Arweave from "arweave";
import {gateway} from "../gateway.js";
import { sortChronological } from './internal/sortChronological.js';
const arweave = Arweave.init(gateway);

export var getComments = async(postTXID, numOfPosts) => {
    if (typeof postTXID != 'string') {
        throw "Post TXID must be a string"
    }
    if (typeof numOfPosts != 'number') {
        throw "Number of posts must be an integer"
    }

    const getID = ( await run(`query($cursor: String) {
        transactions(recipients:["nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U"]
        first: `+numOfPosts+`
        sort: HEIGHT_ASC,
          tags: [
            { name: "App-Name", values: ["Ecclesia"] }
            { name: "Type", values: ["Comment"] }
            { name: "version", values: ["0.0.1"] }
            { name: "Main-Post", values: ["`+postTXID+`"]}
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
    const commentList = []
      for (let comment in getID.data.transactions.edges) {
          if (typeof getID.data.transactions.edges[comment].node.tags[5].value != 'undefined') {
          //console.log('{"comment": "'+getID.data.transactions.edges[comment].node.tags[5].value+'", "timeStamp": "'+getID.data.transactions.edges[comment].node.tags[4].value+'"}')
          commentList.push({"comment": getID.data.transactions.edges[comment].node.tags[5].value, "timeStamp": getID.data.transactions.edges[comment].node.tags[4].value})
     //console.log(getID.data.transactions.edges[comment].node.tags[5].value)
        }
    }
    
        let sortedCommentList = await sortChronological(commentList, numOfPosts)
        sortedCommentList.reverse()
      console.log(sortedCommentList)
      return sortedCommentList
}

//getComments('Ne7OTqA4Ml1gblkWvhItly7mJX93X35NZDIJbG2m-wY',200)