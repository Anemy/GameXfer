// Constants used by the both the client and the server.

// We export it this way so we can pull certain aspects of the constants in files.
module.exports = {
  USERS_IN_LEADERBOARD: 50,
  LEADERBOARD_UPDATE_FREQUENCY_MS: 1000 * 60 * 5 /* 5 minutes */,

  MESSAGE_SUBJECT_MAX_LENGTH: 240,
  MESSAGE_TEXT_MAX_LENGTH: 1000,

  COMMENT_TEXT_MAX_LENGTH: 1000,
  BIOGRAPHY_TEXT_MAX_LENGTH: 1000,

  THREAD_TITLE_MAX_LENGTH: 120,
  THREAD_DESCRIPTION_MAX_LENGTH: 120,

  AVATAR_MAX_FILE_SIZE: 1048576/2 /* 1 MB */,

  MAX_INBOX_LENGTH: 100,

  THREADS_PER_PAGE: 10,
  COMMENTS_PER_PAGE: 10,

  MOST_RECENT_COMMENT: 'mr',

  FORUM_TYPES: {
    TRADING: 0,
    DISCUSSION: 1
  },

  THREAD_TYPES: {
    WTS: {
      abrv: 'wts',
      title: 'Want to sell'
    },
    WTB: {
      abrv: 'wtb',
      title: 'Want to buy'
    },
    WTT: {
      abrv: 'wtt',
      title: 'Want to trade'
    },
    PRC: {
      abrv: 'prc',
      title: 'Price check'
    },
    SERVICE: {
      abrv: 'serv',
      title: 'Service'
    },
    DISCUSSION: {
      abrv: 'disc',
      title: 'Discussion'
    }
  }
};