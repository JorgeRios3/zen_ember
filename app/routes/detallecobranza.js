import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  set,
  get,
  Logger: { info },
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  beforeModel(transition) {
    this._super(...arguments);
    let c = this.controllerFor(this.routeName);
    c.setProperties({
      inmuebles: null,
      totMontoCredito: null,
      totMontoSubsidio: null,
      totDocumentos: null,
      selectedEtapa: 1,
      selecteTipo: 1,
      showNavigation: false
    });
  },
  setupController(ctrl, model) {
    let { etapas, resumencobranza } = model;
    let prevRubro = null;
    let ap = Ember.A();
    let record = {};
    let total = 0;
    let titulosresumen = new Set();
    titulosresumen.add('Rubro');
    resumencobranza.forEach((item)=> {
      let { rubro, rubronombre, etapa, etapanombre, cantidad, cantidadformateada } = item.getProperties('rubro', 'rubronombre', 'etapa', 'etapanombre', 'cantidad', 'cantidadformateada');
      // info(rubro, rubronombre, etapa, etapanombre, cantidad, cantidadformateada);
      if (rubro !== prevRubro) {
        if (prevRubro !== null) {
          record.total = total;
          ap.pushObject(record);
        }
        prevRubro = rubro;
        total = 0;
        record = { rubronombre };
      }
      let newKey = `etapa${etapa}`;
      record[newKey] = cantidadformateada;
      total += cantidad;
      titulosresumen.add(etapanombre);
    });
    if (record !== {}) {
      record.total = total;
      ap.pushObject(record);
    }
    titulosresumen.add('Total');
    ctrl.setProperties({ etapas, resumencobranza: ap, camposresumen: Object.keys(record), titulosresumen });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return Ember.RSVP.hash({
      etapas: store.findAll('etapastramite', reload),
      resumencobranza: store.findAll('resumencobranza', reload)
    });
  },
  actions: {
    error(error) {
      info('error en detallecobranza route', error);
    }
  }
});
