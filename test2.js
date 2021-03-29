import { all, fetchTxTag, run } from 'ar-gql';
import Arweave from "arweave";
import axios from 'axios';
import {devKey} from './devKey.js' //not needed in final version, just for local testing purposes
import {gateway} from "./gateway.js";
import deepHash from 'arweave/web/lib/deepHash.js';
import ArweaveBundles from 'arweave-bundles';
import {createDataItem} from './test.js'

createDataItem('Hi')