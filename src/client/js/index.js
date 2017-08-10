require('./lib/bootstrap-markdown');

import auth from './auth';
import comment from './comment';
import forum from './forum';
import thread from './thread';
import settings from './settings';

auth.enable();
comment.enable();
forum.enable();
thread.enable();
settings.enable();

// if (Raven) {
// Raven.config('https://5ed37515bfdc49afa08a347506af29e8@sentry.io/197712').install();
  
// Raven.captureException('Test error!');
// }