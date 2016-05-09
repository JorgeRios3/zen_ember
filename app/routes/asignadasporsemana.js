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
    let c = this.controllerFor(this.routeName);
    let datos = Ember.A();
    datos.push(['Semana', 'Unidades', { role: 'never' }]);
    c.setProperties({
      options: {
        annotations: {
          alwaysOutside: true,
          textStyle: {
            fontSize: 13,
            auraColor: 'none',
            color: '#555'
          },
          boxStyle: {
            stroke: '#ccc',
            strokeWidth: 1,
            gradient: {
              color1: '#f3e5f5',
              color2: '#f3e5f5',
              x1: '0%', y1: '0%',
              x2: '100%', y2: '100%'
            }
          }
        },
        title: '',
        height: 400,
        width: 700,
        bars: 'horizontal',
        hAxis: {
          title: 'Total de unidades',
          minValue: 0
        }
      }
    });
  },
  desktopOrJumbo: computed('media.isJumbo', 'media.isDesktop', {
    get() {
      return get(this, 'media.isJumbo') || get(this, 'media.isDesktop');
    }
  }),
  setupController(controller, model) {
    let features = get(this, 'features');
    info("features vale",features);
    set(controller, 'features', features);
    let width = 400;
    if (get(this, 'desktopOrJumbo')) {
      width = 700;
    }
    let datos = Ember.A();
    datos.push(['Semana', 'Unidades', { role: 'never' }]);
    model.ventasPorSemana.forEach((item)=> {
      let i10nEN = new Intl.NumberFormat('en-US');
      let datoFormateado = i10nEN.format(get(item, 'valor'));
      datos.push([ get(item, 'intervaloReducido'), get(item, 'valor'), datoFormateado ]);
    });

    controller.setProperties({
      etapas: model.etapasoferta,
      model: datos });
  },
  model() {
    return Ember.RSVP.hash({
      etapasoferta: this.store.query('etapasoferta', { todas: 1 }),
      ventasPorSemana: this.store.query('asignadasporsemana', { semanas: 10 })
    });
  }
});
