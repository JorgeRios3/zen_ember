import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  setProperties,
  Logger: { info },
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,{
  beforeModel(transition) {
    this._super(...arguments);
  },
  setupController(controller, model) {
    let { inmueblesdisponibles } = model;
    setProperties(controller, {
      titleCols: ['Etapa', 'Ocurrencias', 'Valuacion'],
      alignments: ['left', 'right', 'right'],
      inmueblesdisponibles
    });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return hash({
      inmueblesdisponibles: store.findAll('inmueblesdisponiblesarcadia', reload)
    });
  }
});
