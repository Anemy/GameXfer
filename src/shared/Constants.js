// Constants used by the both the client and the server.

// We export it this way so we can pull certain aspects of the constants in files.
module.exports = {
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
    FT: 0,
    ISO: 1,
    WTB: 1,
    DISCUSSION: 2,
  }
};