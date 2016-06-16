import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import moment from 'moment';
const {
  setProperties,
  getProperties,
  get,
  set,
  Logger: { info },
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(RouteAuthMixin, AuthenticatedRouteMixin,
{
  setupController(controller, model) {
    controller.notifyPropertyChange('enganche');
  },
  actions: {
    error(error) {
      info('error', error);
    }
  }
});
