import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
	get,
	set,
	getProperties,
	setProperties,
	RSVP: { hash },
	Logger: { info }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , {
  beforeModel2() {
    info('valor de featues  donde quiero',get(this, 'features.estatuscontabilidad'));
    let estatusContabilidad = get(this, 'features.estatuscontabilidad');
    info('vslor dr la variable contabilidad', estatusContabilidad);
    let estatusFinanzas = get(this, 'features.estatusfinanzas');
    info('valor de finanzas', estatusFinanzas);
    let comisionesSolicitud = get(this, 'features.comisiones_solicitud');
    let estatusLista = [{ 'id': 1, 'label': 'Todo', 'estatus': 'H' }, 
    { 'id': 2, 'label': 'Solicitud', 'estatus': 'S' },
    { 'id': 3, 'label': 'Revisado', 'estatus': 'R' },
    { 'id': 4, 'label': 'Autorizado', 'estatus': 'A' },
    { 'id': 5, 'label': 'Elaborado', 'estatus': 'E' },
    { 'id': 6, 'label': 'Fondeado', 'estatus': 'F' },
    { 'id': 7, 'label': 'Cobrado', 'estatus': 'B' },
    { 'id': 8, 'label': 'Retenido', 'estatus': 'T' },
    { 'id': 9, 'label': 'Cancelado', 'estatus': 'C' }];
    if (comisionesSolicitud) {
      estatusLista.pushObject({ 'id': 10, 'label': 'Comisionable', 'estatus': 'Y' });
      estatusLista.pushObject({ 'id': 11, 'label': 'Comisionado', 'estatus': 'Z' });
    }
    let c = this.controllerFor(this.routeName);
    c.setProperties({
      estatusLista,
      contaFlag: estatusContabilidad,
      finanzasFlag: estatusFinanzas,
      comisionesFlag: comisionesSolicitud,
      selectedEmpresa: '',
      selectedEstatus: '',
      selectedOperacion: '',
      selecteProgramacion: 'N',
      solicitudesLista: null,
      showNavigation: false,
      resultRowCountFormatted: '',
      resultPage: '',
      resultPages: '',
      beneficiario: '',
      formaSolicitud: false,
      nuevoProvedorForma: false,
      beneficiarioNuevo: '',
      beneficiarioFiltro:'',
      selectedBeneficiario: '',
      isCliente: false,
      bene: '',
      bancoDestinoSolicitud: '',
      plazaSolicitud: '',
      sucursalSolicitud: '',
      claveCuentaSolicitud: '',
      selectedCentroCosto: '',
      selectedPartidaEgreso: '',
      selectedsubPartida1: '',
      totalPartida: '',
      listaPartidasEgresoGrabar: Ember.A(),
      errorModal: false,
      listaBeneficiarios: null,
      totalValorPartidas: '',
      fechaProgramadaSolicitud: '',
      soloCliente: false,
      solicitudBuscar: '',
      titleDesenlaceSolicitud: '',
      desenlaSolicitud: false,
      solicitudDesenlace: '',
      selectedEmpresaEdicion: '',
      banderaClonar: false,
      recordSolicitudMaestro: '',
      IsComisionSolicitud: false
    });
  },
  setupController(ctrlr, model) {
    let { empresas, gxsolicitudcheque, fechacaptura, fechaprogramada } = model
    let cuantos = (get(gxsolicitudcheque, 'meta.cuantos'));
    if (cuantos >= 20) {
      set(ctrlr, 'showNavigation', true);
      set(ctrlr, 'resultPage', 1);
      set(ctrlr, 'hayPagSiguientes', true);
      set(ctrlr, 'resultRowCountFormatted', cuantos);
    }
    let fechaProgramada = '';
    fechaprogramada.forEach((item)=> {
      fechaProgramada  = get(item, 'fecha');
    });
    let fechaCaptura = '';
    fechacaptura.forEach((item)=> {
      fechaCaptura = get(item, 'fecha');
    });
    //info('valor de fecha es ', fecha);
    set(ctrlr, 'empresasLista', empresas);
    set(ctrlr, 'solicitudesLista', gxsolicitudcheque);
    set(ctrlr, 'fechaprogramada', fechaProgramada);
    set(ctrlr, 'fechacaptura', fechaCaptura);
  },
  model() {
    return hash({ 
      empresas: this.store.findAll('empresasolicitud'),
      gxsolicitudcheque: this.store.query('gxsolicitudcheque', { estatus: 2}),
      fechacaptura: this.store.findAll('gxfechacaptura'),
      fechaprogramada: this.store.findAll('gxfechaprogramada')
  	})
  }
});
