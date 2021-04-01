import { createThought } from "./posting/createThought";
import { getThought } from "./posting/getThought";
import { createComment } from "./posting/createComment";
import { getComments } from "./posting/getComments";
import { createAccount } from "./accounts/createAccount";
import { follow } from "./accounts/follow";
import { getAccount } from "./accounts/getAccount";
import { getFollowing } from "./accounts/getFollowing";
import { createPFP } from "./accounts/createPFP";

module.exports = {
  createThought,
  getThought,
  createComment,
  getComments,
  createAccount,
  follow,
  getAccount,
  getFollowing,
  createPFP,
};
