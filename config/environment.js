/* jshint node: true */
var credentials = require('../credentials');
module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'zeniclar',
    environment: environment,
    rootURL: '/zeniclar/',
    locationType: 'hash',
    contentSecurityPolicyHeader: 'Content-Security-Policy',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };
  ENV['moment'] = {
    includeTimezone: 'all',
    includeLocales: ['es']
  },
  ENV['contentSecurityPolicy'] = {
    'default-src': "'none'",
    'script-src': "'self' 'unsafe-eval' *.google.com *.gstatic.com",
    'style-src': "'self' 'unsafe-inline' *.google.com *.googleapis.com *.gstatic.com",
    'connect-src': "'self' localhost:4200 ws://10.0.1.124:8888/zen ws://10.0.1.124:8889/zen wss://zen.grupoiclar.com/zen",
    'img-src': "'self'",
    'font-src': "'self' https://s3.amazonaws.com/streams.grupoiclar.com/zeniclar/fonts *.gstatic.com *.googleapis.com"
  };
  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.DEVLINK = 'arcadiavendidos';
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.contentSecurityPolicy['script-src'] = ENV.contentSecurityPolicy['script-src'] + " 'unsafe-eval'";
  
    ENV.AUTOMATIC_LOGIN = credentials.automatic_login;
    //ENV.DISTANCIA = true;
    ENV.WSOCKETS_URL = "ws://10.0.1.124:8889/zen";
    ENV.AUTOMATIC_LOGIN_IDENTIFICATION = credentials.user;
    ENV.AUTOMATIC_LOGIN_PASSWORD = credentials.password;
    
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.WSOCKETS_URL = "wss://zen.grupoiclar.com/zen";
    ENV.AUTOMATIC_LOGIN = false;

  }

  return ENV;
};
