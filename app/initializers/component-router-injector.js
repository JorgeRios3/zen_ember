export function initialize(application) {
  // application.inject('route', 'foo', 'service:foo');
  application.inject('service', 'router', 'router:main');
}

export default {
  name: 'component-router-injector',
  initialize
};
