import auth from './auth';
import thread from './thread';

auth.enable();
thread.enable();

// if (Raven) {
// Raven.config('https://5ed37515bfdc49afa08a347506af29e8@sentry.io/197712').install();
  
// Raven.captureException('Test error!');
// }