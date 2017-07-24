const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

class Environment {
  static loadEnvironment() {
    // We use the 'window' global variable to discern if the environment is running on the client or the server.
    // By default this is not defined in node.js and only ezists in the browser.
    this.server = typeof window === 'undefined';
    this.client = !this.server;

    if (this.server) {
      this.environment = process.env.GAMEXFER_ENV;
    } else {
      // TODO: Pull environment from the server somehow.
      this.environment = DEVELOPMENT;
    }

    console.log('Loaded environment:', this.environment);
  }

  static isDev() {
    return this.environment === DEVELOPMENT;
  }

  static isProd() {
    return this.environment === PRODUCTION;
  }

  static get() {
    return this.environment;
  }

  static setEnvironment(newEnvironment) {
    this.environment = newEnvironment;
  }
}

Environment.loadEnvironment();

export default Environment;