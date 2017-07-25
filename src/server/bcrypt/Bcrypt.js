import { fork } from 'child_process';
import uuid from 'uuid/v4';

import Constants from '../ServerConstants';

const bcryptProcess = fork(__dirname + '/BcryptProcess.js');

bcryptProcess.on('message', (m) => {
  bcryptCallBacks[m.id](m);
});

let bcryptCallBacks = [];

export default {
  // Performs a bcrypt hash on the supplied password and calls the callback async when it's completed.
  getBCryptHash: (hashType, toHash, callback) => {
    const callbackID = uuid();
    bcryptCallBacks[callbackID] = (m) => { 
      if (m.hasHash || hashType === Constants.LOGIN_HASH) {
        callback(m.hash);
      }
      delete bcryptCallBacks[callbackID];
    };

    bcryptProcess.send({
      hashType: hashType,
      color: toHash,
      id: callbackID
    });
  }
};