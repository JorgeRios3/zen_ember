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
    datos.push( ['Rubro', 'Unidades', { role: 'never' }]);
    model.datosPanorama.forEach((item)=> {
      datos.push([ get(item, 'rubroReducido'), get(item, 'valor'), 'gold' ]);
    });
    controller.setProperties({
      etapas: model.etapasoferta,
      options: {
        //title: 'Panorama Comercial',
        height: 400,
        bars: 'horizontal',
        width,
         hAxis: {
          title: 'Total de unidades',
          minValue: 0
        }
      },
      model: datos
    });
  },
  model() {
    let { store } = this;
    return Ember.RSVP.hash({
      etapasoferta: store.query('etapasoferta', { todas: 1 }),
      datosPanorama: store.query('panorama', {})
    });
  }
});