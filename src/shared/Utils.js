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
      username !== username.replace(/[^\w\s]/gi, '') || // Only allow characters, numbers, spaces, underscore and dash.
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

  static validBiography(text) {
    return text && text.length < Constants.BIOGRAPHY_TEXT_MAX_LENGTH;
  }

  // @return {Boolean} - If the supplied subject is valid for a message.
  static validMessageSubject(subject) {
    return subject && subject.length > 10 && subject.length < Constants.MESSAGE_SUBJECT_MAX_LENGTH;
  }

  // @return {Boolean} - If the supplied text is valid for a message.
  static validMessageText(text) {
    return text && text.length > 10 && text.length < Constants.MESSAGE_TEXT_MAX_LENGTH;
  }

  static validThreadType(type) {
    if (type === undefined) {
      return false;
    }

    let validType = false;

    Object.keys(Constants.THREAD_TYPES).forEach((THREAD_TYPE) => {
      if (type === Constants.THREAD_TYPES[THREAD_TYPE].abrv) {
        validType = true;
      }
    });

    return validType;
  }

  static validThreadTitle(title) {
    return title && title.length > 10 && title.length < Constants.THREAD_TITLE_MAX_LENGTH;
  }

  static validThreadDescription(description) {
    return description && description.length > 0 && description.length < Constants.THREAD_DESCRIPTION_MAX_LENGTH;
  }

  static validCommentText(text) {
    return text && text.length > 5 && text.length < Constants.COMMENT_TEXT_MAX_LENGTH;
  }

  static getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    const variableName = name.replace(/[[\]]/g, '\\$&');

    const regex = new RegExp('[?&]' + variableName + '(=([^&#]*)|&|#|$)');
    let results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}

export default Utils;