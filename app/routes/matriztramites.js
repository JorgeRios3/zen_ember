import Ember from 'ember';

import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  set,
  get,
  Logger: { info }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  beforeModel(transition) {
    this._super(...arguments);
    let c = this.controllerFor(this.routeName);
  },
  setupController(ctrl, model) {
    set(ctrl, 'etapas', model.etapas);
    set(ctrl, 'catalogoTramites', model.catalogoTramites);
  },
  model() {
    let { store } = this;
    store.unloadAll('etapastramite');
    store.unloadAll('catalogotramite');
    return Ember.RSVP.hash({
      catalogoTramites: store.findAll('catalogotramite'),
      etapas: store.findAll('etapastramite')
    });
  }
});
