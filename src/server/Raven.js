import Environment from '../shared/Environment'; 
import Raven from 'raven';

export default {
  capture: () => {
    if (Environment.isProd()) {
      Raven.config('https://5ed37515bfdc49afa08a347506af29e8:4f0f344d05d64bcb910ceedb4ae59383@sentry.io/197712').install();
    }
  }
};