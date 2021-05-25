// import {devKey} from '../devKey.js'; //This imports the devs personal key from a file in .gitignore, and will be replaced once the library is ready for use
import { createFollowerList } from './internal/createFollowerList.js';

// const key = devKey
export var unfollowAll = async(key) => {
createFollowerList(key)
}

//unfollowAll(key)