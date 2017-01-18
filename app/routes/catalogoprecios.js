import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  set,
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, {
  setupController(ctrl, model) {
    set(ctrl, 'etapas', model.etapas);
    set(ctrl, 'listaPrecios', model.precios);
  },
  beforeModel2() {

  },
  model() {
    let { store } = this;
    for (let modelo of 'etapastramite'.w()) {
      store.unloadAll(modelo);
    }
    return hash({
      etapas: store.findAll('etapastramite'),
      precios: store.findAll('preciosinmueble')
    });
  }
});

