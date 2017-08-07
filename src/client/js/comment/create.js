import $ from 'jquery';

import Utils from '../../../shared/Utils';

class CreateComment {
  constructor() {
    this.performingAction = false;

    this.messageShown = false;
  }

  showStatusMessage(statusString, className) {
    if(!this.messageShown) {
      $('.js-create-comment-message').removeClass('hide');
    }

    $('.js-create-comment-message').text(statusString);
    $('.js-create-comment-message').removeClass('message-success message-failure message-working');
    $('.js-create-comment-message').addClass(className);
  }

  hideStatusMessage() {
    this.messageShown = false;
    $('.js-create-comment-message').addClass('hide');
  }

  performCreateCommentRequest() {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showStatusMessage('Working...', 'message-working');

      // Basic validation before making a request.
      if (!$('.js-create-comment-text').val()) {
        this.performingAction = false;
        this.showStatusMessage('Error: Please fill out the comment field.', 'message-failure');
        return;
      }

      const text = $('.js-create-comment-text').val();
      const forumId = $('.js-forum-id').attr('data-forum-id');
      const threadId = $('.js-thread-id').attr('data-thread-id');

      // Ensure the message conforms to the message guidelines. 
      if (!Utils.validCommentText(text)) {
        this.performingAction = false;
        this.showStatusMessage('Error: Invalid comment. Please check the comment guidelines.', 'message-failure');
        return;
      }

      $.post('/comment/create', {
        forumId: forumId,
        threadId: threadId,
        text: text
      }).done(() => {
        this.showStatusMessage('Success! Redirecting in 2 seconds.', 'message-success');
        setTimeout(() => {
          this.showStatusMessage('Success! Redirecting in 1 seconds.', 'message-success');
        }, 1000 /* 1s */);
        setTimeout(() => {
          // Redirect to the most recent comment.
          window.location.replace(`/f/${forumId}/t/${threadId}/c/mr`);
        }, 2000 /* 2s */);
      }).fail((err) => {
        this.showStatusMessage('Error: ' + err.responseJSON.err, 'message-failure');
        this.performingAction = false;
      });
    }
  }

  startListening() {
    // When the users type into the text fields, hide the last shown message, unless we are currently performing an action.
    $('.js-create-comment-text').keypress(() => {
      if (!this.performingAction) {
        this.hideStatusMessage();
      }
    });
    
    $('.js-create-comment').on('click', (e) => {
      e.preventDefault();

      this.performCreateCommentRequest();
    });
  }
}

export default new CreateComment();