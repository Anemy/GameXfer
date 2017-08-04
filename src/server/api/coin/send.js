// Performs a transaction sending xferCoin from one user to another.

import sync from 'synchronize';

import db from '../../Database';
import Utils from '../../../shared/Utils';

export default (req, res) => {
  let destination = req.body.destination;
  let amount = req.body.amount;
  let message = req.body.message; // Optional

  // Ensure the request has the proper attributes.
  if (destination === undefined || amount === undefined) {
    res.status(400).send({
      err: 'Invalid send xfer coin request. Please specify a destination and amount.'
    });
    return;
  }

  if (!Utils.isNumber(amount) || Number(amount) < 0) {
    res.status(400).send({
      err: 'Invalid amount to send.'
    });
    return;
  }

  amount = Number(amount);
  amount = Math.floor(amount);

  sync.fiber(() => {
    const destinationUser = sync.await(db.collection('users').findOne({
      username: destination
    }, { 
      xferCoin: 1,
      username: 1
    }, sync.defer()));

    if (!destinationUser) {
      // We couldn't find the user to send to.
      res.status(400).send({
        err: 'Invalid destination user.'
      });
      return;
    }

    // Ensure the user can send the amount of money.
    const user = sync.await(db.collection('users').findOne({
      username: req.username,
      xferCoin: {
        $gte: amount
      }
    }, { 
      xferCoin: 1,
      username: 1
    }, sync.defer()));

    if (!user || !destinationUser) {
      // We couldn't find the user with the correct amount to withdraw.
      res.status(400).send({
        err: 'Invalid amount to send. You need more funds.'
      });
      return;
    }

    const newTransaction = {
      sender: req.username,
      destination: destination,

      amount: amount,
      message: message,

      status: 'initiated',
      createdAt: new Date() // The current time.
    };

    // Save the new transaction.
    const transaction = sync.await(db.collection('transactions').insert(newTransaction, sync.defer()));

    if (!transaction) {
      res.status(400).send({
        err: 'Unable to initiate transaction.'
      });
      return;
    }

    // Remove the coin from the sender's wallet.
    const fundsSent = sync.await(db.collection('users').update({
      username: req.username,
      xferCoin: {
        $gte: amount
      }
    }, { 
      $inc: {
        xferCoin: -amount
      }
    }, sync.defer()));

    if (!fundsSent || fundsSent.nModified !== 1) {
      res.status(500).send({
        err: 'Unable to send xferCoin.'
      });
      return;
    }

    const transactionUpdate = sync.await(db.collection('transactions').update({
      _id: transaction._id
    }, { 
      $set: {
        status: 'sent',
        sentAt: new Date()
      }
    }, sync.defer()));

    if (!transactionUpdate || transactionUpdate.nModified !== 1) {
      res.status(500).send({
        err: 'Error: Unable to update xferCoin transaction status. Please contact an admin. Your funds were sent and not recieved.'
      });
      return;
    }

    // Send the coin to the destination's wallet.
    const fundsRecieved = sync.await(db.collection('users').update({
      username: destination
    }, { 
      $inc: {
        xferCoin: amount
      }
    }, sync.defer()));

    if (!fundsRecieved || fundsRecieved.nModified !== 1) {
      res.status(500).send({
        err: 'Error: Unable to recieve xferCoin. Please contact an admin.'
      });
      return;
    }

    // Now that the transaction has occured we're going to update the status of the transaction.
    sync.await(db.collection('transactions').update({
      _id: transaction._id
    }, { 
      $set: {
        status: 'completed',
        completedAt: new Date()
      }
    }, sync.defer()));

    res.status(200);
    res.send({
      err: false,
      success: true
    });
  });
};

