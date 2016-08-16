import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	get,
	set,
	RSVP: { hash },
	Logger: { info },
	computed,
  inject: { service }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , {
  comodin: service(),
  setupController(ctrlr, model) {
    let comodin = get(this, 'comodin');
    let listaEtapas = Ember.A();
    let { gtevdor, gerentesventa: apGerentesventas, vendedor: apVendedors, gerentecomision, etapasLista } = model;
    etapasLista.forEach((item)=> {
      listaEtapas.pushObject(item);
    });
    let features = get(this, 'features');
    set(ctrlr, 'features', features);
    let gerente = get(gtevdor, 'idgerente');
    let vendedor = get(gtevdor, 'idvendedor');
    if (gerente !== 0 && vendedor !== 0) {
      set(ctrlr, 'selectedGerente', gerente);
      set(ctrlr, 'auxselectedVendedor', vendedor);
    }
    if (get(comodin, 'vendedorEstadoCuentaAndPagos')) {
      let vendedorGerente = get(comodin, 'vendedorEstadoCuentaAndPagos');
      set(ctrlr, 'selectedGerente', get(vendedorGerente, 'gerente'));
      Ember.run.later('', ()=> {
        set(ctrlr, 'selectedVendedor', get(vendedorGerente, 'vendedor'));
      }, 2000);
      // set(ctrlr, 'vienedePagoComisiones', get(comodin, 'vendedorEstadoCuentaAndPagos'));
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
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      gerenteVendedor: '',
      nombre: '',
      cuantosvendedores: 0,
      selectedGerente: null,
      listaDocumentosComision: null,
      listaMovimientosComision: null,
      muestraDocumentos: true,
      recordPago: null,
      mostrarModal: false,
      totalSaldo: 0,
      totalCargo: 0,
      totalAbono: 0,
      totalSaldoEtapa: 0,
      totalCargoEtapa: 0,
      totalAbonoEtapa: 0,
      showComisiones: false,
      mostrarBotonReporte: false,
      mostrarFormaRecibo: false,
      mostrarComisionManual: false
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
  },
  actions: {
    willTransition(transition) {
      let comodin = get(this, 'comodin');
      let adonde = transition.targetName;
      let controller = this.controllerFor(this.routeName);
      try {
        if (!adonde.includes('pagoscomisiones')) {
          set(comodin, 'vendedorEstadoCuentaAndPagos', '');
        }
        let pago = get(controller, 'recordPago');
        let saldo = get(pago, 'pagoimporte');
        if (parseFloat(saldo) > 0) {
          info(' no puedes salir de la ruta por que hay saldo pendiente', saldo);
          set(controller, 'mostrarModal', true);
          transition.abort();
        }
      } catch(e) {
        // set(comodin, 'vendedorEstadoCuentaAndPagos', '');
        info('saliendo por catch no hay record');
        set(controller, 'selectedVendedor', null);
      }
    },
    error(error) {
      let controller = this.controllerFor(this.routeName);
      let comodin = get(this, 'comodin');
      set(comodin, 'vendedorEstadoCuentaAndPagos', '');
      set(controller, 'selectedVendedor', null);
      info('error en ruta prospecto', error);
    }
  }
});
