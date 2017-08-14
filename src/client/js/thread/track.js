import $ from 'jquery';

import Constants from '../../../shared/Constants';

const trackText = 'Track Thread';
const untrackText = 'Untrack Thread';

class TrackThread {
  constructor() {
    this.performingAction = false;
  }

  cleanButtons() {
    $('.js-track-button').removeClass('inverted-forum-ui-button'); // Ensure we aren't pumping tons of classes.
    $('.js-track-icon').removeClass('fa-tasks  fa-minus  fa-plus');
  }

  showUntracked() {
    this.cleanButtons();

    $('.js-track-button').removeClass('inverted-forum-ui-button'); // Ensure we aren't pumping tons of classes.
    $('.js-track-button').addClass('inverted-forum-ui-button');
    $('.js-track-icon').addClass('fa-minus');
    $('.js-track-text').text(untrackText);
  }

  showTracked() {
    this.cleanButtons();

    $('.js-track-icon').addClass('fa-plus');
    $('.js-track-text').text(trackText);
  }

  showWorking() {
    this.cleanButtons();

    $('.js-track-button').addClass('inverted-forum-ui-button');
    $('.js-track-icon').addClass('fa-tasks');
  }

  // Returns if the thread is currently being tracked.
  getCurrentlyTracking() {
    return $('.js-track-button').hasClass('inverted-forum-ui-button');
  }

  performTrackThreadRequest(trackThread) {
    if (!this.performingAction) {
      this.performingAction = true;

      this.showWorking();

      const forumId = $('.js-forum-id').attr('data-forum-id');
      const threadId = $('.js-thread-id').attr('data-thread-id');

      $.post('/thread/track', {
        forumId: forumId,
        threadId: threadId,
        trackThread: trackThread
      }).done((msg) => {
        if (trackThread) {
          this.showUntracked();
        } else {
          this.showTracked();
        }

        if (trackThread && msg && msg.trackedThreadsLength > Constants.SHOW_TRACKING_LIMIT && msg.timesShownTrackingLimitWarning < Constants.TRACKING_LIMIT_WARNING_TIMES) {
          // Show the user the message that we're deleting their old tracked threads automatically.
          alert(`Just a heads up - you're currently tracking ${msg.trackedThreadsLength} threads. When that number hits ${Constants.MAX_TRACKED_LENGTH} we're going to start automatically removing your oldest tracked posts. Sorry for any inconvenience, we'll show this warning ${Constants.TRACKING_LIMIT_WARNING_TIMES-msg.timesShownTrackingLimitWarning} more time(s).`);
        }

        this.performingAction = false;
      }).fail(() => {
        alert('Failed to track thead. Please refresh and try again. You may have to wait 5 minutes before tracking another thread.');

        // When it fails reset the state.
        if (trackThread) {
          this.showTracked();
        } else {
          this.showUntracked();
        }

        this.performingAction = false;
      });
    }
  }

  startListening() {
    $('.js-track-button').click(() => {
      // Check if the user is logged in before we do anything.
      // When they aren't logged in we redirect them to log in.
      if (!$('.js-user').attr('data-user')) {
        window.location.replace('/login?re=' + window.location.pathname);

        return;
      }

      this.performTrackThreadRequest(!this.getCurrentlyTracking());
    });
  }
}

export default new TrackThread();