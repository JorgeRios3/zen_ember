import Ember from 'ember';

import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  set,
  get,
  Logger: { info },
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  beforeModel(transition) {
    this._super(...arguments);
    let c = this.controllerFor(this.routeName);
  },
  setupController(ctrl, model) {
    let { etapas } = model;
    ctrl.setProperties({ etapas });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return hash({
      etapas: store.findAll('etapastramite', reload)
    });
  }
});
