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
  beforeModel2() {
    // this._super(...arguments);
    let c = this.controllerFor(this.routeName);
  },
  setupController(ctrl, model) {
    let { etapas, catalogoTramites, matriztramites } = model;
    ctrl.setProperties({ etapas, catalogoTramites, matriztramites });
    // set(ctrl, 'etapas', etapas);
    // set(ctrl, 'catalogoTramites', model.catalogoTramites);
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    // store.unloadAll('etapastramite');
    // store.unloadAll('catalogotramite');
    return Ember.RSVP.hash({
      catalogoTramites: store.findAll('catalogotramite', reload),
      etapas: store.findAll('etapastramite', reload),
      matriztramites: store.findAll('matriztramite', reload)
    });
  }
});
