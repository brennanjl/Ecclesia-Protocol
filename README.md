# ecclesia-protocol
JS Library for interacting with Ecclesia.

# Installation

```
npm install ecclesia-js
```

# Usage 

Functions:

```getDataByTXID(TXID)```
 - Accesses the data associated with that TXID.

```createThought(text, photo_path, private_key)```
 - Creates a post, and stores the photo in a separate transaction.  There is a maximum character limit of 300.  This is due to the fact that text data is stored in the transaction metadata, which has a hard cap of 2 kb.  By doing this, all text posts can be queried with one request, as opposed to making one request per post.  Long posts (ThinkPieces) will not have this, and will therefore require a different function.
 
```getThought(public_key, number_of_posts)```
 - Gets the most recent posts made by the individual with that public key.  You can query for any number of posts, if you exceed the max that exist for that user it will just return all of them.  Posts are sorted by newest, so getPost(publicKey, 5) will get the 5 most recent posts by that individual.  This will return a JSON with text, time stamp, image TXID, and the post's own TXID.  Example: `const posts = getThought('Cf1cXx1wENt0XOA9wMoTWYB-rvP0jEdGS1gdQN7XkvQ', 10)`
`posts[0].thought` will return the most recent post's text, `posts[0].timeStamp` will return the most recent timeStamp, and `posts[0].photoTXID` will return the TXID of the associated photo.  This TXID can be accessed by using `getDataByTXID(posts[0].photoTXID)`.  The post's own TXID can be retrieved using `posts[0].postTXID`.

```createComment(text, main_post_TXID, private_key)```
 - Creates a comment for the specified post.

```getComment(postTXID, number_of_comments)```
 - Gets the specified number of comments for the post, querying the oldest ones first (this can be switched if need be).
 
```createAccount(name, biography, private_key)```
 - Creates a new account tied to that public key.  In the future, public keys will be hidden from the user with a unique naming handle (will be done with smart contract, not necessary for mvp).
 
 ```createPFP(photo, private_key)```
 - Creates a profile picture for the account.

```getAccount(address)```
 - Gets all account info for that address.  The data that can is stored is name, biography, address, and pfpTXID.  Example: `getAccount('Cf1cXx1wENt0XOA9wMoTWYB-rvP0jEdGS1gdQN7XkvQ').pfpTXID`
