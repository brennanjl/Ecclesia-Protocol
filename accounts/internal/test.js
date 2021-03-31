import Arweave from 'arweave';
import {gateway} from "../../gateway.js";
import { all, fetchTxTag, run } from 'ar-gql';
import axios from 'axios';
import {devKey} from '../../devKey.js'; //This imports the devs personal key from a file in .gitignore, and will be replaced once the library is ready for use
import { createFollowerList } from './createFollowerList.js';
const arweave = Arweave.init(gateway);

const key = devKey
const followList = {}

followList['Donald'] = 1
delete followList['Donald']


console.log(followList)

createFollowerList(key)