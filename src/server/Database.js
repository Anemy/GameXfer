/*
This file manages the database connection and manages the database tasks.
*/

import mongojs from 'mongojs';

import ServerUtils from './ServerUtils';

// Connect to the database.
const db = mongojs(ServerUtils.getMongoDBURL());

export default db;