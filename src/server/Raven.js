import Environment from '../shared/Environment'; 
// import Raven from 'raven';

export default {
  capture: () => {
//     if (Environment.isProd()) {
//       if (!process.env.RAVEN_KEY) {
//         throw new Error('ERROR: Raven key not defined in environment.');
//       } else {
//         Raven.config(process.env.RAVEN_KEY).install();
//       }
//     }
  },

  logError: (err) => {
//     if (Environment.isProd()) {
//       Raven.captureException(err);
//     }
    console.log('an error occured': err);
  }
};
