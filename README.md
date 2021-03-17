# ecclesia-protocol
JS Library for interacting with Ecclesia.

NOTE: For development purposes, I have a devKey.js that exports my private key in JSON so that I don't have to reenter on every file.

Functions:

createPost(string)
 - Creates a post, currently only supports text but will support images soon.
 
getPost(publicKey, number of posts)
 - Gets the most recent posts made by the individual with that public key.  Posts are sorted by newest, so getPost(publicKey, 5) will get the 5 most recent posts by that individual.
 
createAccount(name, biography, address)
 - Creates a new account tied to that address.  In the future, addresses will be hidden from the user with a unique naming handle (will be done with smart contract, not necessary for mvp).

getAccount(address)
 - Gets all account info for that address.
