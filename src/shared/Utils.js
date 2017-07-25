/**
 * Utility functions shared by multiple classes.
 **/

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
}

export default Utils;