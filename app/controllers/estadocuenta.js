import Ember from 'ember';
// import ajax from 'ember-ajax';
// import EmberValidations from 'ember-validations';
// import config from '../config/environment';

const {
  get,
  set,
  observer,
  computed,
  isEmpty,
  Logger: { info },
  inject: { service }
} = Ember;

export default Ember.Controller.extend({
  session: service(),
  selectedNombre: '',
  selectedEtapa: null,
  selectedDoc: null,
  cuantos: '',
  catalogoNombres: null,
  isArcadia: false,
  etapasArcadia: null,
  etapasDefinitiva: null,
  docsCliente: null,
  error: '',
  nombre: '',
  idDocumento: '',
  manzana: '',
  lote: '',
  cuenta: '',
  cliente: '',
  saldo: '',
  movimientosdocumento: null,
  maximo: computed.lt('cuantos', 101),
  conPagares: null,
  saldoPagares: '',
  saldoFormateado: '',
  saldoPagaresFormateado: '',
  documentosPagares: null,
  saldoCuenta: '',
  observaIsArcadia: observer('isArcadia', function() {
    info('aqui ando en observacion');
    let isArcadia = get(this, 'isArcadia');
    let company = isArcadia ? 'arcadia' : '';
    let etapas = Ember.A();
    set(this, 'company', company);
    this.store.unloadAll('etapastramite');
    this.store.unloadAll('documentoscliente');
    this.store.unloadAll('movimientosdocumento');
    this.store.unloadAll('clientescuantosconcuentanosaldada');
    set(this, 'catalogoNombres', null);
    set(this, 'etapas', this.store.query('etapastramite', { company }));
  }),
  observaSelectedNombre: observer('selectedNombre', function() {
    let that = this;
    let company = get(this, 'company');
    this.store.unloadAll('documentoscliente');
    let cuenta = get(this, 'selectedNombre');
    // info(`valor de cuenta ${cuenta}`);
    let cual = get(this, 'catalogoNombres').findBy('cuenta', cuenta);
    // info(`valor de cual ${cual}`);
    let p = this.store.query('documentoscliente', { cuenta, company });
    set(this, 'docsCliente', p);
    set(this, 'cuenta', cual.get('cuenta'));
    set(this, 'manzana', cual.get('manzana'));
    set(this, 'lote', cual.get('lote'));
    set(this, 'saldo', cual.get('saldo'));
    set(this, 'conPagares', get(cual, 'conpagares'));
    set(this, 'saldoPagaresFormateado', get(cual, 'saldopagaresformateado'));
    if (get(this, 'conPagares') === true) {
      set(this, 'documentosPagares', this.store.query('documentopagare', { cuenta }));
    }
    set(this, 'cliente', cual.get('cliente'));
  }),

  actions: {
    procesaDocumento(idDocumento, abono) {
      let company = get(this, 'company');
      this.store.unloadAll('movimientosdocumento');
      info(`valor de id documento ${idDocumento} valor de abono ${abono}`);
      set(this, 'movimientosdocumento', this.store.query('movimientosdocumento', { documento: idDocumento, company }));
    },
    selectedNombre(item) {
      set(this, 'selectedNombre', item.cuenta);
    },
    selectedEtapa(item) {
      set(this, 'selectedEtapa', item.id);
    },
    buscar() {
      let that = this;
      let company = get(this, 'company');
      let nombre = get(this, 'nombre');
      let etapa = get(this, 'selectedEtapa');
      info(`valor de selectedEtapa ${etapa}`);
      set(this, 'catalogoNombres', null);
      this.store.query('clientescuantosconcuentanosaldada' , { etapa, nombre, estadocuenta: 1, company })
      .then((data)=> {
        if (get(data, 'length')) {
          data.forEach((item)=> {
            set(that, 'cuantos', get(item, 'cuantos'));
          });
        }
        if (parseInt(get(this, 'cuantos')) <= 100) {
          return this.store.query('clientesconcuentanosaldada', { etapa, nombre, estadocuenta: 1, company })
            .then((data)=> {
              set(that, 'catalogoNombres', data);
            });
        }
      });
    }
  }
});
