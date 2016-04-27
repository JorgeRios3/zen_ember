import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  set,
  get,
  Logger: { info }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
  RouteAuthMixin, {
  beforeModel(transistion) {
  	this._super(...arguments);
  	let c = this.controllerFor(this.routeName);
    c.setProperties({
      datos: null,
      selectedEtapa: ''
    })
  },
  setupController(ctrl, model) {
    set(ctrl, 'etapas', model);
    //set(ctrl, 'fecha', get(model, 'meta.hoy'));
  },
  model() {
    return this.store.findAll('etapastramite');
  }
});
