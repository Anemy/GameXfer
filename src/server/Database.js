/*
This file manages the database connection and manages the database tasks.
*/

import mongojs from 'mongojs';

import ensureDatabaseCollections from './database/ensureDatabaseCollections';
import ServerUtils from './ServerUtils';

// Connect to the database.
const db = mongojs(ServerUtils.getMongoDBURL());

// Ensure the indexes of the database. This keeps duplicates out and speeds up the process.
db.collection('threads').createIndex({ 
  threadId: 1,
  forumId: 1
}, {
  unique: true
});

db.collection('threads').createIndex({ 
  author: 1
});

db.collection('users').createIndex({ 
  username: 1 
}, {
  unique: true
});

db.collection('forums').createIndex({
  forumId: 1
}, {
  unique: true
});

db.collection('messages').createIndex({
  sender: 1
});

db.collection('messages').createIndex({
  destination: 1
});

// TODO: Remove this hack.
setTimeout(() => {
  ensureDatabaseCollections.populateForums();
});

export default db;