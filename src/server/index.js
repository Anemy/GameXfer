/*
@Copyright 2017, GameXfer, All rights reserved.

Entrypoint of running the server.
*/

import bodyParser from 'body-parser';
import cluster from 'cluster';
import connectMongo from 'connect-mongo';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import moment from 'moment';
import os from 'os';
import path from 'path';
import session from 'express-session';

import Environment from '../shared/Environment';
import router from './router';
import ServerUtils from './ServerUtils';

let numCPUs = os.cpus().length;

// We decrease the number of processes to run by one in order to leave an open spot for the bcrypt server.
if (numCPUs > 1) {
  numCPUs--;
}

if (!Environment.isDev() && cluster.isMaster) {
  console.log(`Master ${process.pid} is running.`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died.`);
  });
} else {
  const PORT = 8080;

  const app = express();

  app.locals.moment = moment;

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

  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '100mb'
  }));
  app.use(bodyParser.json({
    limit: '100mb'
  }));

  app.use(express.static(path.join(__dirname + '/../..', 'public')));

  app.set('views', path.join(__dirname, '/../client/views'));
  app.set('view engine', 'pug');

  app.use('/', router);

  https.createServer(certOptions, app).listen(PORT, () => {
    console.log('Pid', process.pid, Environment.get(), 'server listening on port', PORT, '\\o/');
  });

  // Redirect from http port 3001 (redirected from 80) to https.
  if (Environment.isProd()) {
    http.createServer((req, res) => {
      res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url });
      res.end();
    }).listen(3001);
  }
}