// Be careful, this script updates or inserts each of the forums in the forum list array.
// Run with command: `babel-node --debug --presets es2015 createForums.js`

import _ from 'underscore';
import sync from 'synchronize';

import { FORUM_TYPES } from '../shared/Constants';
import db from '../server/Database.js';

const forumList = [{
  forumId: 'test',
  title: 'Test Game_Name',
  type: FORUM_TYPES.TRADING // Trading forum.
}, {
  forumId: 'csgo',
  title: 'Counter Strike',
  type: FORUM_TYPES.TRADING // Trading forum.
}, {
  forumId: 'pc',
  title: 'PC Discussion',
  type: FORUM_TYPES.DISCUSSION // Discussion forum.
}];

sync.fiber(() => {
  console.log('Script starting: Updating and inserting the new/updated forums.');

  _.each(forumList, (forum) => {
    // Update or insert the forum.
    const updateInsertResult = sync.await(db.collection('forums').update({
      forumId: forum.forumId
    }, {
      $set: forum
    }, {
      upsert: true
    }, sync.defer()));

    if (updateInsertResult && (updateInsertResult.n === 1 || updateInsertResult.nModified === 1 || updateInsertResult.nInserted === 1)) {
      console.log('Inserted or updated forum:', forum.title);
    } else {
      console.log('Error with forum:', forum, 'updateInsertResult:', updateInsertResult, 'no update occured. This already exists or database error.');
    }
  });

  console.log('Script complete.');
});