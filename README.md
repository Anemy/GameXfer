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
  - lastActivity `Date`
  - messagesLength `Number` - The amount of messages in the user's inbox. Saves counting operation time.
  - messages `Array` - An array of the user's messages. Can hold up to 100 messages at a time.
    - sender `String` - The _id of the user who sent the message.
    - subject `String`
    - text `String`
    - sentAt `Date`
    - readAt `Date` - Set when the message has been read.
  - sentMessages `Array` - An array of the user's last 10 sent messages.
    - destination `String` the _id of the destination user.
    - subject `String`
    - text `String`
    - sentAt `Date`

#### forums

- forum
  - title `String`
  - type `String` - Discussion, trading, services, etc.
  - threads `Array`