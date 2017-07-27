/*
This file manages the database connection and manages the database tasks.
*/

import mongojs from 'mongojs';

import ServerUtils from './ServerUtils';

// Connect to the database.
const db = mongojs(ServerUtils.getMongoDBURL());

// Ensure the indexes of the database. This keeps duplicates out.
db.collection('threads').ensureIndex({ 
  threadId: 1,
  forumId: 1
}, {
  unique: true
});

db.collection('users').ensureIndex({ 
  username: 1 
}, {
  unique: true
});

db.collection('forums').ensureIndex({
  forumId: 1
}, {
  unique: true
});

export default db;