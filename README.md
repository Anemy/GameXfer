# GameXfer
[Gamexfer.com](http://gamexfer.com)

## Installation

Install node js from https://nodejs.org/en/download/

Install mongodb from https://docs.mongodb.com/getting-started/shell/installation/

```bash
$ npm install
$ npm install -g eslint
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
  - _id `String`
  - username `String`
  - password `String` - Hashed via bcrypt
  - xferCoin `Number`
  - createdAt `Date`
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
  - forumId `String` - These need to be unique, and try to keep them low (look at other forums when creating them).
  - title `String`
  - type `String` - Discussion, trading, services, etc.
  - threadHeaders `Array` - Sorted by 
    - threadId `String`
    - threadTitle `String`
    - mostRecentCommentTime `Date`
    - mostRecentCommentAuthor `String`
    - mostRecentThreadTime `Date`
    - mostRecentThreadAuthor `String`

#### Threads

- thread
  - threadId `String`
  - forumId `String`
  - subject `String`
  - commentsLength `String`
  - mostRecentCommentTime `Date`
  - mostRecentCommentAuthor `String` - Their username.
  - comments `Array`
   - commentId `String`
   - author `String`
   - text `String`
   - createdAt `Date`