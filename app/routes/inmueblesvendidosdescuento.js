import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  get,
  set,
  Logger: { info },
  RSVP: { hash },
  setProperties
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin, {
  beforeModel2() {
  	let controller = this.controllerFor(this.routeName);
  	controller.setProperties({
  	  fechaInicial: '',
  	  fechaFinal: '',
  	  inmueblesLista: Ember.A(),
  	  nullFechaInicial: null,
  	  nullFechaFinal: null,
  	  selectedEtapa: '',
  	  cuantos: '',
  	  totalneto: '',
  	  totalbase: '',
  	  totaldescuento: '',
      totalSubsidio: '',
      totalvendidosporetapa: '',
      requestedPage: ''
  	});
  },
  setupController(ctrl, model) {
    let {etapas, listaDescuentos} = model;
    set(ctrl, 'etapas', etapas);
  },
  
  model() {
  	let date, time = new Date().toLocaleString('en-US').split(', ');
    let b=time[0].split("/");
    let c = `${b[2]}/${b[0]}/${b[1]}`;
    return hash({
      etapas: this.store.findAll('etapastramite', { reload: true }),
      // listaDescuentos: this.store.query('inmueblesvendidosdescuento', { fechainicial: c, fechafinal: c })
    });
  }
});
