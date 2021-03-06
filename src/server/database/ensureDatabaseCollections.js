import _ from 'underscore';
import sync from 'synchronize';

import Forums from '../../shared/Forums';
import db from '../Database.js';
import Environment from '../../shared/Environment';

export default {
  populateForums: () => {
    sync.fiber(() => {
      const forumIds = Forums.getAllForumIds();

      let updatedAddedCounter = 0;
      let failureCounter = 0;

      _.each(forumIds, (forumId) => {
        // Update or insert the forum.
        const updateInsertResult = sync.await(db.collection('forums').update({
          forumId: forumId
        }, {
          $set: {
            forumId: forumId
          }
        }, {
          upsert: true
        }, sync.defer()));

        if (updateInsertResult && updateInsertResult.nInserted === 1) {
          console.log('Created forum', forumId, 'in the database.');
          updatedAddedCounter++;
        } else if (updateInsertResult && (updateInsertResult.n === 1 || updateInsertResult.nModified === 1 || updateInsertResult.nInserted === 1)) {
          updatedAddedCounter++;
        } else {
          failureCounter++;
          console.log('Error with forum:', forumId, 'updateInsertResult:', updateInsertResult, ' No update occured. This already exists or database error.');
        }
      });

      if (Environment.isDev()) {
        console.log('Ensured the presence of', updatedAddedCounter, 'forums in the database.', failureCounter, 'failed.');
      }
    });
  }
};