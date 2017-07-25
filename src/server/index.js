/*
@Copyright 2017, GameXfer, All rights reserved.

Entrypoint of running the server.
*/

import bodyParser from 'body-parser';
import connectMongo from 'connect-mongo';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import session from 'express-session';

import Environment from '../shared/Environment';
import router from './router';
import ServerUtils from './ServerUtils';

const PORT = 3000;

const app = express();

const MongoStore = connectMongo(session);

let certOptions;

if (Environment.isDev()) {
  certOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
  };
} else if(Environment.isProd()) {
  // TODO: Prod https certificate.
  certOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
  };
}

// Set up session storing.
app.use(session({
  secret: 'GameXfer...SECRET_12321!...kittens',
  saveUninitialized: false,
  resave: true,
  store: new MongoStore({
    url: ServerUtils.getMongoDBURL(),
    ttl: 24 * 60 * 60 * 365 // 1 Year expiration.
  })
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/../..', 'public')));

app.set('views', path.join(__dirname, '/../client/views'));
app.set('view engine', 'pug');

app.use('/', router);

https.createServer(certOptions, app).listen(PORT, () => {
  console.log(Environment.get(), 'server listening on port', PORT);
});

// Redirect from http port 80 to https.
if (Environment.isProd()) {
  http.createServer((req, res) => {
    res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url });
    res.end();
  }).listen(80);
}