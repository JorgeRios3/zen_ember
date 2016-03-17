import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	get,
	set,
	RSVP: { hash },
	Logger: { info },
	computed
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , {
  beforeModel(transition) {
    this._super(...arguments);
  },
  desktopOrJumbo: computed('media.isJumbo', 'media.isDesktop', {
    get() {
      return get(this, 'media.isJumbo') || get(this, 'media.isDesktop');
    }
  }),
  setupController(controller, model) {
    let width = 400;
    if (get(this, 'desktopOrJumbo')) {
      width = 700;
    }
    let datos = Ember.A();
    datos.push(['Dia', 'Valores']);
    model.ventasPorDia.forEach((item)=> {
      datos.push([get(item, 'dia'), get(item, 'valor')]);
    });
    controller.setProperties({
      titulo: 'Ventas promedio por dia',
      etapas: model.etapasoferta,
      options: {
        title: '',
        height: 400,
        width
      },
      model: datos
    });
  },
  model() {
    let { store } = this;
    return Ember.RSVP.hash({
      ventasPorDia: store.findAll('ventaspordia')
    });
  }
});
