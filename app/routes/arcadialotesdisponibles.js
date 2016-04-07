import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  setProperties,
  getProperties,
  Logger: { info },
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(RouteAuthMixin, AuthenticatedRouteMixin,
{
  beforeModel() {
    this._super(...arguments);
  },
  setupController(controller, model) {
    let lotesdisponibles = Ember.A();
    model.lotesdisponibles.forEach((item)=> {
      lotesdisponibles.pushObject(getProperties(item, 'etapa', 'cuantos', 'valuacion'));
    });
    setProperties(controller, {
      titleCols: ['Etapa', 'Ocurrencias', 'Valuacion'],
      alignments: ['left', 'right', 'right'],
      lotesdisponibles
    });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return hash({
      lotesdisponibles: store.findAll('lotesdisponiblesarcadia', reload)
    });
  }
});

