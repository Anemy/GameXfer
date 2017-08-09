import $ from 'jquery';

class Logout {
  constructor() {
    this.performingAction = false;

    this.messageShown = false;
  }

  showStatusMessage(statusString, className) {
    if(!this.messageShown) {
      this.messageShown = true;
      $('.js-logout-status-message').removeClass('hide');
    }

    $('.js-logout-status-message').text(statusString);
    // Clear all of the other states before adding ours.
    $('.js-logout-status-message').removeClass('message-success message-failure message-working');
    $('.js-logout-status-message').addClass(className);
  }

  hideStatusMessage() {
    this.messageShown = false;
    $('.js-logout-status-message').addClass('hide');
  }

  performLogoutRequest() {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showStatusMessage('Working...', 'message-working');

      $.post('/logout').done(() => {
        this.showStatusMessage('Logged out. Refreshing...', 'message-success');
        window.location.replace('/');
      }).fail((err) => {
        if (err && err.responseJSON) {
          this.showStatusMessage('Error: ' + err.responseJSON.err, 'message-failure');
        } else {
          this.showStatusMessage('Error: ' + err.responseText || 'unknown. Please check console', 'message-failure');
        }
        this.performingAction = false;
      });
    }
  }

  startListening() {
    $('.js-logout').on('click', (e) => {
      e.preventDefault();

      $('.js-logout-page').removeClass('hide');

      this.performLogoutRequest();
    });
  }
}

export default new Logout();