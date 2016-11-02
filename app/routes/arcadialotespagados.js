import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  setProperties,
  Logger: { info },
  set,
  get,
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, {
  setupController(controller, model) {
    info('entro');
    set(controller, 'titleCols', ['Etapa', 'Pagados', 'No Escriturados', 'Escriturados' ]);
    set(controller, 'alignments', ['left', 'right', 'right', 'right']);
    let lista = Ember.A();
    let totalPagados = 0;
    let totalNoEscriturados = 0;
    let totalEscriturados = 0;
    model.forEach((item)=> {
      let { etapa, pagados, noescriturados, escriturados } = item.getProperties(['etapa', 'pagados', 'noescriturados', 'escriturados']);
      totalPagados += pagados;
      totalNoEscriturados += noescriturados;
      totalEscriturados +=  escriturados;
      lista.pushObject({ etapa, pagados, noescriturados, escriturados });
    });
    // lista.pushObject({ etapa: 'Totales', pagados: totalPagados, noescriturados: totalNoEscriturados, escriturados: totalEscriturados });
    set(lista.get('lastObject'), 'etapa', 'Totales');
    set(controller, 'datos', lista);
    info('termino');
  },
  model() {
    return this.store.findAll('lotespagadosarcadia');
  }
});
