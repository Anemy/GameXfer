# GameXfer
[Gamexfer.com](http://gamexfer.com)

## Installation

Install node js from https://nodejs.org/en/download/

Install mongodb from https://docs.mongodb.com/getting-started/shell/installation/

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
    - messageId `String` - Just incremented by 1 everytime a new message is recieved.
    - sender `String` - The _id of the user who sent the message.
    - subject `String`
    - text `String`
    - sentAt `Date`
    - readAt `Date` - Set when the message has been read.

#### Forums

- forum
  - forumId `String` or `Number` - Unique. Try to keep ids low (look at other forums when creating them).
  - title `String`
  - type `String` - Discussion, trading, services, etc.
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
  - threadId `String` or `Number` - Unique in combination with forumId.
  - forumId `String` - Unique in combination with threadId.
  - title `String`
  - description `String`
  - views `Number`
  - mostRecentCommentTime `Date`
  - mostRecentCommentAuthor `String`
  - commentsLength `String`
  - comments `Array`
   - commentId `String`
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