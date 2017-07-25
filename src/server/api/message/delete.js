// Handles the request to delete inbox message(s).

import sync from 'synchronize';

import db from '../../Database';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid message request.'
    });
    return;
  }

  const messagesToDelete = req.body.messagesToDelete;

  // Ensure the request has the proper attributes.
  if (!messagesToDelete || !Array.isArray(messagesToDelete)) {
    res.status(400).send({
      err: 'Invalid message to send.'
    });
    return;
  }

  sync.fiber(() => {
    // Delete the messages from the user's inbox.
    const updatedUser = sync.await(db.collection('users').findAndModify({
      query: {
        username: req.username,
      }, 
      update: {
        $pull: { 
          messages: {
            messageId: {
              $in: messagesToDelete
            }
          }
        }
      },
      fields: {
        messages: 1
      },
      new: 1
    }, sync.defer()));

    if (!updatedUser) { 
      res.status(400).send({
        err: 'Error: Unable to delete message(s).'
      });
      return;
    }

    // When we've successfully deleted a message then we update the new messages length.
    sync.await(db.collection('users').update({
      username: req.username,
    }, {
      $set: {
        messagesLength: updatedUser.messages.length
      }
    }, sync.defer()));

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    
    // TODO: Render the user's inbox after deleting a message, or the page they were just at.
    res.redirect('/');
  });
};

