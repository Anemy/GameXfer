import $ from 'jquery';

import Utils from '../../../shared/Utils';

class CreateThread {
  constructor() {
    this.performingAction = false;

    this.messageShown = false;
  }

  showStatusMessage(statusString, className) {
    if(!this.messageShown) {
      $('.js-create-thread-message').removeClass('hide');
    }

    $('.js-create-thread-message').text(statusString);
    $('.js-create-thread-message').removeClass('message-success message-failure message-working');
    $('.js-create-thread-message').addClass(className);
  }

  hideStatusMessage() {
    this.messageShown = false;
    $('.js-create-thread-message').addClass('hide');
  }

  performCreateThreadRequest() {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showStatusMessage('Working...', 'message-working');

      // Basic validation before making a request.
      if (!$('.js-create-thread-title').val() || !$('.js-create-thread-description').val() || !$('.js-create-thread-text').val()) {
        this.performingAction = false;
        this.showStatusMessage('Error: Please fill out all of the fields.', 'message-failure');
        return;
      }

      const title = $('.js-create-thread-title').val();
      const description = $('.js-create-thread-description').val();
      const text = $('.js-create-thread-text').val();
      const forumId = $('.js-forum-id').attr('data-forum-id');

      // Ensure the title of the message conforms to the guidelines. 
      if (!Utils.validThreadTitle(title)) {
        this.performingAction = false;
        this.showStatusMessage('Error: Invalid thread title.', 'message-failure');
        return;
      }

      if (!Utils.validThreadDescription(description)) {
        this.performingAction = false;
        this.showStatusMessage('Error: Invalid thread description.', 'message-failure');
        return;
      }

      // Ensure the message conforms to the message guidelines. 
      if (!Utils.validCommentText(text)) {
        this.performingAction = false;
        this.showStatusMessage('Error: Invalid first comment.', 'message-failure');
        return;
      }

      $.post('/thread/create', {
        forumId: forumId,
        title: title,
        description: description,
        text: text
      }).done((msg) => {
        if (!msg || !msg.threadId) {
          this.showStatusMessage('Error posting thread... Please try again.', 'message-failure');
          this.performingAction = false;

          return;
        }

        this.showStatusMessage('Success! Redirecting...', 'message-success');
        window.location.replace(`/f/${forumId}/t/${msg.threadId}`);
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
    // When the users type into the text fields, hide the last shown message, unless we are currently performing an action.
    $('.js-create-thread-title, .js-create-thread-description, .js-create-thread-text').keypress(() => {
      if (!this.performingAction) {
        this.hideStatusMessage();
      }
    });
    
    $('.js-create-thread').on('click', (e) => {
      e.preventDefault();

      this.performCreateThreadRequest();
    });
  }
}

export default new CreateThread();