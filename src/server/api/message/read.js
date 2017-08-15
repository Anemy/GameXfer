// Handles when a user views a message for the first time.

import sync from 'synchronize';

import db from '../../Database';

export default (req, res) => {
  if (!req || !req.body) {
    res.status(400).send({
      err: 'Invalid message request.'
    });
    return;
  }

  const messagesToMarkRequested = req.body.messagesToMark;
  // Cast to boolean.
  const markAsRead = req.body.markAsRead === 'true';

  // Ensure the request has the proper attributes.
  if (!messagesToMarkRequested || !Array.isArray(messagesToMarkRequested)) {
    res.status(400).send({
      err: 'Invalid message to mark.'
    });
    return;
  }

  const messagesToMark = Object.keys(messagesToMarkRequested).map((key) => {
    return messagesToMarkRequested[key];
  });

  sync.fiber(() => {
    const currentTime = new Date();

    let update = {};
    if (markAsRead) {
      // Mark it as unread.
      update.$set = {
        readAt: currentTime
      };
    } else {
      // Mark it as unread.
      update.$unset = {
        readAt: 1
      };
    }

    // When we've successfully deleted a message then we update the new messages length.
    const updatedMessages = sync.await(db.collection('messages').update({
      destination: req.username,
      _id: {
        $in: messagesToMark
      }
    }, update, {
      multi: true
    }, sync.defer()));    

    if (!updatedMessages || updatedMessages.n !== messagesToMark.length) { 
      res.status(400).send({
        err: 'Unable to update message(s).'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send({
      err: false,
      msg: 'success'
    });

    // See if we can mark the user as having no unread.
    if (markAsRead) {
      const unreadCount = sync.await(db.collection('messages').count({
        destination: req.username,
        readAt: {
          $exists: false
        },
        deletedAt: {
          $exists: false
        }
      }, sync.defer()));

      if (unreadCount === 0) {
        db.collection('users').update({
          username: req.username
        }, {
          hasUnread: (unreadCount !== 0)
        });    
      }
    }
  });
};

