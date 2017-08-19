# GameXfer
[Gamexfer.com](http://gamexfer.com)

See `LICENSE.txt` for the license.

## Installation

Install node js from https://nodejs.org/en/download/

Install mongodb from https://docs.mongodb.com/getting-started/shell/installation/

We use `dotenv` for storing environment variables around confidential/secret tokens. Message Rhys for for that file.

```bash
$ npm install
$ npm install -g gulp
$ npm install -g eslint
$ npm install -g babel-cli # For one off scripts. # Might be optional - I need to test.
$ npm install -g nodemon
```

## Deployment

#### Development

```bash
$ mongod # Ensure mongodb is running on the system. Look below if you need to create collections.
$        # Mongo looks for the database `gamexfer_test` on development.
$        # I'll write a script soon, for now just ask me how to do this.
$ npm run start-dev
$ browser https://localhost:3000
```

## Database Schemas

#### Users

- user
  - username `String` - Unique, lower case.
  - displayUsername `String` - Username with upper case available.
  - avatarURL `String` - S3 CDN url.
  - biography `String` - Stored as HTML, edited as markdown.
  - password `String` - Hashed via bcrypt
  - xferCoin `Number`
  - createdAt `Date`
  - posts: `Number`
  - mostRecentCommentTime `Date`
  - mostRecentCommentId `String`
  - mostRecentCommentThreadId `String`
  - mostRecentCommentForumId `String`
  - messagesRecievedTotal `Number`
  - messagesLength `Number` - The amount of messages in the user's inbox. Saves counting operation time. Counted via the messages collection.
  - deletedMessages - `Array of messages ^` - Stores last 5 deleted messages in a queue.
  - timesShownTrackingLimitWarning `Number` - We warn a user when they're tracking the max amount of threads. This makes them warn a limited amount.
  - trackedThreads `Array` - An array of the thread ids the user has tracked. Can hold up to 50 tracks at a time.
    - threadId `String` - Unique in combination with forumId.
    - forumId `String` - Unique in combination with threadId.
    - uniqueThreadId `String` - The thread's individual id not related to forumId.
    - trackedAt `Date`

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
  - author `String` - The username of the creator of the thread.
  - type `String` The type of thread. The types are defined in the shared constants.
  - mostRecentCommentTime `Date`
  - mostRecentCommentAuthor `String`
  - commentsLength `String`
  - comments `Array`
   - commentId `Number` - Incremented by each new comment.
   - author `String`
   - text `String` - HTML string. Built via quill.
   - createdAt `Date`

#### Messages

- messages
  - messageId `String` - Uuid timestamped.
  - sender `String` - The username of the user who sent the message.
  - destination `String` - The username of the user who recieved the message.
  - subject `String`
  - text `String` - HTML string. Built via quill.
  - sentAt `Date`
  - deletedAt `Date` - When the message was deleted. There is a max amount of these per destination
  - readAt `Date` - When the message was read. (If the message is unread this is unset.)

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

