/**
 * Utility functions shared by multiple classes.
 **/

import Constants from './Constants';

class Utils {
  /**
   * @return {boolean} - true or false half the time.
   */
  static halfChance() {
    return Math.random() < 0.5;
  }

  static isNumber(n) {
    return !isNaN(n-0) && n !== null && n !== '' && n !== false;
  }

  // @return {Boolean} - If the supplied email is valid.
  static validEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  // @return {Boolean} - If the supplied username is valid.
  static validUsername(username) {
    return !(!username ||
      (username !== username.replace(/[^\w\s]/gi, '')) || // Only allow characters, numbers, spaces, underscore and dash.
      username.match(/\s{2,}/g) || // Double spaces
      username.length < 1 || 
      username.length > 16 ||
      username.match(/Anonymous/g) ||
      username.match(/<|>/g));
  }

  // @return {Boolean} - If the supplied password is valid.
  static validPassword(password) {
    return !(!password ||
      password.length < 2 ||
      password.length > 16);
  }

  // @return {Boolean} - If the supplied subject is valid for a message.
  static validMessageSubject(subject) {
    return subject && subject.length > 0 && subject.length < Constants.MESSAGE_SUBJECT_MAX_LENGTH;
  }

  // @return {Boolean} - If the supplied text is valid for a message.
  static validMessageText(text) {
    return text && text.length > 0 && text.length < Constants.MESSAGE_TEXT_MAX_LENGTH;
  }

  static validThreadTitle(title) {
    return title && title.length > 0 && title.length < Constants.THREAD_TITLE_MAX_LENGTH;
  }

  static validThreadDescription(description) {
    return description && description.length > 0 && description.length < Constants.THREAD_DESCRIPTION_MAX_LENGTH;
  }

  static validCommentText(text) {
    return text && text.length > 0 && text.length < Constants.COMMENT_TEXT_MAX_LENGTH;
  }
}

export default Utils;