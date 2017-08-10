/**
 * This is a purely static file which contains info around forums.
 *
 * These are inserted into the database through a script.
**/

import _ from 'underscore';

import { FORUM_TYPES } from './Constants';

// const ForumCategories = {
//   'Trending': { // What's lit.
//     icon: 'bolt'
//   }, 
//   'Gaming': {
//     icon: 'gamepad'
//   },
//   'Trading': {
//     icon: 'exchange'
//   },
//   'Computer': {
//     icon: 'laptop'
//   },
//   'Miscellaneous': {
//     icon: 'bolt'
//   },
//   'Steam': {
//     icon: 'bolt'
//   },
//   'Markets': {
//     icon: 'bolt'
//   },
//   'Guides': {
//     icon: 'question-circle'
//   },
//   'Graphics': {
//     icon: 'bolt'
//   },
//   'GameXfer': {
//     icon: 'bolt'
//   }
// };

const forums = {
  // Games
  'bazaar': {
    title: 'The Bazaar',
    type: FORUM_TYPES.TRADING,
    categories: ['Trending', 'Trading', 'Markets', 'GameXfer']
  },
  'csgo': {
    title: 'Counter Strike: Global Offensive',
    type: FORUM_TYPES.TRADING,
    categories: ['Trending', 'Trading', 'Gaming', 'Steam']
  },
  'rs': {
    title: 'Runescape',
    type: FORUM_TYPES.TRADING,
    categories: ['Trending', 'Trading', 'Gaming']
  },
  'wow': {
    title: 'World of Warcraft',
    type: FORUM_TYPES.TRADING,
    categories: ['Trading', 'Trending', 'Gaming']
  },
  'ow': {
    title: 'Overwatch',
    type: FORUM_TYPES.TRADING,
    categories: ['Trading', 'Gaming']
  },
  'rocket': {
    title: 'Rocket League',
    type: FORUM_TYPES.TRADING,
    categories: ['Trading', 'Trending', 'Gaming', 'Steam']
  },
  'dota': {
    title: 'Dota 2',
    type: FORUM_TYPES.TRADING,
    categories: ['Trading', 'Gaming']
  },
  'lol': {
    title: 'League of Legends',
    type: FORUM_TYPES.TRADING,
    categories: ['Trading', 'Gaming']
  },
  'gw2': {
    title: 'Guild Wars 2',
    type: FORUM_TYPES.TRADING,
    categories: ['Trading', 'Gaming', 'Steam']
  },
  'rs-guides': {
    title: 'Runescape Guides',
    type: FORUM_TYPES.TRADING,
    categories: ['Gaming', 'Guides']
  },
  'rust': {
    title: 'Rust',
    type: FORUM_TYPES.TRADING,
    categories: ['Gaming', 'Steam']
  },
  'd2': {
    title: 'Diablo 2',
    type: FORUM_TYPES.TRADING,
    categories: ['Trending', 'Trading', 'Gaming']
  },
  'd3': {
    title: 'Diablo 3',
    type: FORUM_TYPES.TRADING,
    categories: ['Trending', 'Trading', 'Gaming']
  },
  'vg': {
    title: 'Video Game Trading',
    type: FORUM_TYPES.TRADING,
    categories: ['Markets', 'Trading', 'Gaming']
  },

  // Markets
  'steam': {
    title: 'Steam',
    type: FORUM_TYPES.TRADING,
    categories: ['Trending', 'Gaming', 'Markets']
  },
  'xbox': {
    title: 'Xbox',
    type: FORUM_TYPES.TRADING,
    categories: ['Gaming', 'Markets']
  },

  // Random
  'pc': {
    title: 'Computer Discussion',
    type: FORUM_TYPES.DISCUSSION,
    categories: ['Trending', 'Computer']
  },
  'build-pc': {
    title: 'Computer Building Discussion',
    type: FORUM_TYPES.DISCUSSION,
    categories: ['Computer', 'Guides']
  },
  'rl': {
    title: 'Real Life',
    type: FORUM_TYPES.DISCUSSION,
    categories: ['Miscellaneous']
  },
  'bg': {
    title: 'Board Games',
    type: FORUM_TYPES.DISCUSSION,
    categories: ['Miscellaneous', 'Gaming']
  },
  'ot': {
    title: 'Off Topic',
    type: FORUM_TYPES.DISCUSSION,
    categories: ['Miscellaneous']
  },

  // GameXfer
  'ss': {
    title: 'Site Suggestions',
    type: FORUM_TYPES.DISCUSSION,
    categories: ['GameXfer', 'Miscellaneous']
  },

  // Graphics
  'gfx': {
    title: 'Graphics',
    type: FORUM_TYPES.TRADING,
    categories: ['Graphics']
  },
  'gfx-guides': {
    title: 'Graphics Guides',
    type: FORUM_TYPES.TRADING,
    categories: ['Guides', 'Graphics']
  }
};
// Assign the id to each of the forums. This is easier than having another field on each to start.
_.each(forums, (forum, index) => {
  forum.forumId = index;
});

// Sends back an array of the all of the forum categories with and array of title and id of the forums in the category.
// TODO: Remove data duplication.
function getAllForumsByCategory() {
  let forumsByCategory = {};

  _.each(forums, (forum) => {
    _.each(forum.categories, (category) => {
      if (!forumsByCategory[category]) {
        forumsByCategory[category] = [];
      }

      forumsByCategory[category].push({
        forumId: forum.forumId,
        title: forum.title
      });
    });
  });

  return forumsByCategory;
}

const allForumsByCategory = getAllForumsByCategory();

export default {
  forumsAndCategories: allForumsByCategory,
  getForumInfoById: (forumId) => {
    return forums[forumId];
  },
  getAllForumIds: () => {
    return Object.keys(forums);
  }
};