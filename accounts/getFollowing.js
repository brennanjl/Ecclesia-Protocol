import { all, fetchTxTag, run } from "ar-gql";
import Arweave from "arweave";
import axios from "axios";
import { gateway } from "../gateway.js";
import { getDataFromTXID } from "../Internal/getDataFromTXID";
import { sortChronological } from "../Internal/sortChronological.js";
const arweave = Arweave.init(gateway);

export var getFollowing = async (publicKey) => {
  if (typeof publicKey != "string") {
    throw "Invalid Public Key: Key must be a string";
  }

  if (publicKey.length != 43) {
    throw "Invalid Public Key: Key must be 43 characters long";
  }

  const getFollowingList = await run(
    `query($cursor: String) {
        transactions(owners:["` +
      publicKey +
      `"]
        recipients:["nYxifPxxc1LmxIq3RIMyLE2hnNZ5fdVZlDZ0f-5qa4U"]
        first: 3
        sort: HEIGHT_DESC,
          tags: [
            { name: "App-Name", values: ["Ecclesia"] }
            { name: "Type", values: ["Follow"] }
          ]
          after: $cursor
        ) 
        {
          edges {
            cursor
            node {
                id
                tags{
                    name
                    value
                }
            }
          }
        }
      }`
  );

  const postList = [];
  for (let post in getFollowingList.data.transactions.edges) {
    postList.push({
      timeStamp:
        getFollowingList.data.transactions.edges[post].node.tags[4].value,
      TXID: getFollowingList.data.transactions.edges[post].node.id,
    });
  }

  let recentFollowList = await sortChronological(postList, 3);

  let followList = await getDataFromTXID(recentFollowList[0].TXID);

  console.log(followList.data.followers);
  return followList.data;
};
