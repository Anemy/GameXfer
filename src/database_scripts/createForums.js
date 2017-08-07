// Be careful, this script updates or inserts each of the forums in the forum list array.
// Run with command: `babel-node --debug --presets es2015 createForums.js`

import _ from 'underscore';
import sync from 'synchronize';

import Forums from '../shared/Forums';
import db from '../server/Database.js';

sync.fiber(() => {
  console.log('Script starting: Updating and inserting the new/updated forums.');

  const forumIds = Forums.getAllForumIds();

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

    if (updateInsertResult && (updateInsertResult.n === 1 || updateInsertResult.nModified === 1 || updateInsertResult.nInserted === 1)) {
      console.log('Inserted or updated forum:', forumId);
    } else {
      console.log('Error with forum:', forumId, 'updateInsertResult:', updateInsertResult, ' No update occured. This already exists or database error.');
    }
  });

  console.log('Script complete. You may safely ctrl+c to close.');
});