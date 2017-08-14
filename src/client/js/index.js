import auth from './auth';
import comment from './comment';
import forum from './forum';
import inbox from './inbox';
import settings from './settings';
import texteditor from './texteditor';
import thread from './thread';

auth.enable();
comment.enable();
inbox.enable();
forum.enable();
settings.enable();
texteditor.enable();
thread.enable();

// if (Raven) {
// Raven.config('https://5ed37515bfdc49afa08a347506af29e8@sentry.io/197712').install();
  
// Raven.captureException('Test error!');
// }