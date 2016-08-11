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
  setupController(ctrlr,model) {
    let listaEtapas = Ember.A();
    let { gtevdor, gerentesventa: apGerentesventas, vendedor: apVendedors, gerentecomision, etapasLista } = model;
    etapasLista.forEach((item)=> {
    	listaEtapas.pushObject(item);
    });
    let gerente = get(gtevdor, 'idgerente');
    let vendedor = get(gtevdor, 'idvendedor');
    if (gerente !== 0 && vendedor !== 0) {
      set(ctrlr, 'selectedGerente', gerente);
      set(ctrlr, 'auxselectedVendedor', vendedor);
      info('les puso valor a ambos');
    }
    ctrlr.setProperties({
      gtevdor,
      apGerentesventas,
      apVendedors,
      gerentecomision,
      listaEtapas
    });

  },
  beforeModel2() {
  	let c= this.controllerFor(this.routeName);
  	c.setProperties({
      auxselectedVendedor: null,
      selectedGerente: null,
      selectedVendedor: null,
      listaPagosComision: null
    });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    this.store.unloadAll('gtevdor');
    return hash({
      gtevdor: store.findRecord('gtevdor', 1),
      gerentesventa: store.findAll('gerentesventa', reload),
      vendedor: store.findAll('vendedor', reload),
      gerentecomision: store.findAll('gerentecomision'),
      etapasLista: store.findAll('etapastramite')
    });
  }
});
