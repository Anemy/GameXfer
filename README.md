# GameXfer
[Gamexfer.com](http://gamexfer.com)
See `LICENSE.txt` for the license.

## Installation

Install node js from https://nodejs.org/en/download/

Install mongodb from https://docs.mongodb.com/getting-started/shell/installation/

We use `dotenv` for storing environment variables around confidential/secret tokens. Message Rhys for for that file.

```bash
$ npm install
$ npm install -g eslint
$ npm install -g babel-cli # for scripts
$ npm install -g nodemon
```

## Deployment

#### Development

```bash
$ mongod # Ensure mongodb is running on the system.
$ npm run start:dev
$ browser https://localhost:3000
```

## Database Schemas

#### Users

- user
  - username `String` - Unique, lower case.
  - displayUsername `String` - Username with upper case available.
  - avatarURL `String` - S3 CDN url.
  - biography `String`
  - password `String` - Hashed via bcrypt
  - xferCoin `Number`
  - createdAt `Date`
  - posts: `Number`
  - mostRecentCommentTime `Date`
  - mostRecentCommentId `String`
  - mostRecentCommentThreadId `String`
  - mostRecentCommentForumId `String`
  - messagesRecievedTotal `Number`
  - messagesLength `Number` - The amount of messages in the user's inbox. Saves counting operation time.
  - messages `Array` - An array of the user's messages. Can hold up to 100 messages at a time.
    - messageId `String` - Uuid timestamped.
    - sender `String` - The _id of the user who sent the message.
    - subject `String`
    - text `String`
    - sentAt `Date`
    - readAt `Date` - Set when the message has been read.

#### Forums - The info about certain forums is contained in `src/shared/Forums.js`

- forum
  - forumId `String`
  - threadsCreatedTotal `Number`
  - mostRecentThreadId `String` - The id of the most recently created thread. Not necessarily the most recently commented.
  - mostRecentThreadTime `Date`
  - mostRecentThreadAuthor `String`
  - mostRecentCommentId `String`
  - mostRecentCommentTime `Date`
  - mostRecentCommentAuthor `String`
  - mostRecentCommentThreadId `String`

#### Threads

- thread
  - threadId `String` - Unique in combination with forumId. It's the count of the actual forum in that thread.
  - forumId `String` - Unique in combination with threadId.
  - title `String`
  - description `String`
  - views `Number`
  - mostRecentCommentTime `Date`
  - mostRecentCommentAuthor `String`
  - commentsLength `String`
  - comments `Array`
   - commentId `Number` - Incremented by each new comment.
   - author `String`
   - text `String`
   - createdAt `Date`

#### Transactions

- transaction
  - destination `String` - Username.
  - sender `String` - Username.
  - message `String`
  - status `String` - The status of the transaction - 'initiated', 'sent', or 'recieved'.
  - amount `Number` - The number of xferCoin sent.
  - createdAt `Date`
  - sentAt `Date`
  - completedAt `Date`