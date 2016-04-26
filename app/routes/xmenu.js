import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  get,
  set,
  Logger: { info }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , {
  beforeModel(transition) {
    this._super(...arguments);
  },
  model() {
  	return this.store.findAll('xmenu', {reload: true});
  }

});
