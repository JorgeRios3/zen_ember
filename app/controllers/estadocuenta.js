import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';

const {
  get,
  set,
  observer,
  computed,
  isEmpty,
  Logger: { info },
  inject: { service, controller }
} = Ember;

export default Ember.Controller.extend(FormatterMixin,
{
  session: service(),
  ci: controller('index'),
  totalVencido: 0,
  documentosVencidos: 0,
  numeroDocumentos: 0,
  cargos: 0,
  abonos: 0,
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
  showButton: false,
  showData: false,
  saldoPagaresFormateado: '',
  documentosPagares: null,
  saldoCuenta: '',
  recibo: '',
  recibosmovimientosLista: null,
  documentosSelec: null,
  movimientosMayorAUno: computed.gt('recibosmovimientosLista.length', 1),
  cuentaBuscar: '',
  mostrarNombreClienteAlert: false,
  showName: '',
  showCuenta: '',
  derechosArcadia: computed('ci.perfil', {
    get() {
      let permiso = false;
      switch (get(this, 'ci.perfil')) {
        case 'admin':
        case 'finanzas':
        case 'cobranza':
          permiso = true;
          break;
        default:
          permiso = false;
      }
      return permiso;
    }
  }),
  saldoFormateado: computed('saldo', {
    get() {
      return this.formatter(get(this, 'saldo'));
    }
  }),
  cargosFormateado: computed('cargos', {
    get() {
      return this.formatter(get(this, 'cargos'));
    }
  }),
  abonosFormateado: computed('abonos', {
    get() {
      return this.formatter(get(this, 'abonos'));
    }
  }),
  totalVencidoFormateado: computed('totalVencido', {
    get() {
      return this.formatter(get(this, 'totalVencido'));
    }
  }),
  observaNombre: observer('nombre', function() {
    if (get(this, 'nombre').length > 2) {
      this.setProperties({
        showButton: true
      });
    }
  }),
  observaCuentaBuscar: observer('cuentaBuscar', function() {
    if (get(this, 'cuentaBuscar').length >= 4) {
      let company = get(this, 'company');
      let cuenta = get(this, 'cuentaBuscar');
      this.store.query('cuentabreve', { company, cuenta })
      .then((data)=> {
        data.forEach((item)=> {
          if (get(item, 'id') && get(item, 'nombre')) {
            set(this, 'mostrarNombreClienteAlert', true);
            set(this, 'showName', get(item, 'nombre'));
            set(this, 'showCuenta', get(item, 'id'));
          } else {
            set(this, 'mostrarNombreClienteAlert', false);
            set(this, 'showName', '');
            set(this, 'showCuenta', '');
          }
        });
      });
    }
  }),
  observaTodo: observer('isArcadia', 'selectedEtapa', 'nombre', function() {
    this.setProperties({
      showData: false
    });
  }),
  observaIsArcadia: observer('isArcadia', function() {
    info('aqui ando en observacion');
    let isArcadia = get(this, 'isArcadia');
    let company = isArcadia ? 'arcadia' : '';
    let etapas = Ember.A();
    let { store } = this;
    set(this, 'company', company);
    store.unloadAll('etapastramite');
    store.unloadAll('documentoscliente');
    store.unloadAll('movimientosdocumento');
    store.unloadAll('clientescuantosconcuentanosaldada');
    set(this, 'catalogoNombres', null);
    set(this, 'etapas', this.store.query('etapastramite', { company }));
  }),
  observaSelectedNombre: observer('selectedNombre', function() {
    let that = this;
    let totalVencido = 0;
    let numeroDocumentos = 0;
    let documentosVencidos = 0;
    let cargos = 0;
    let abonos = 0;
    let company = get(this, 'company');
    this.store.unloadAll('documentoscliente');
    let cuenta = get(this, 'selectedNombre');
    // info(`valor de cuenta ${cuenta}`);
    let cual = get(this, 'catalogoNombres').findBy('cuenta', cuenta);
    // info(`valor de cual ${cual}`);
    let p = this.store.query('documentoscliente', { cuenta, company });
    p.then((data)=> {
      data.forEach((item)=> {
        if (get(item, 'documentoVencido')) {
          totalVencido += parseFloat(get(item, 'saldo').replace(',', ''));
          documentosVencidos++;
        }
        numeroDocumentos++;
        cargos += parseFloat(get(item, 'cargo').replace(',', ''));
        abonos += parseFloat(get(item, 'abono').replace(',', ''));
      });
      info('total vencido', totalVencido, 'yessir');
      set(this, 'totalVencido', totalVencido);
      set(this, 'documentosVencidos', documentosVencidos);
      set(this, 'numeroDocumentos', numeroDocumentos);
      set(this, 'cargos', cargos);
      set(this, 'abonos', abonos);
    });
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
    set(this, 'showData', true);
  }),

  actions: {
    buscarConCuenta(){
      let nombre = get(this, 'showName');
      let cuenta = get(this, 'showCuenta');
      let company = get(this, 'isArcadia');
      let p = this.store.query('documentoscliente', { cuenta, company });
      p.then((data)=> {
        data.forEach((item)=> {
          if (get(item, 'documentoVencido')) {
            totalVencido += parseFloat(get(item, 'saldo').replace(',', ''));
            documentosVencidos++;
          }
          numeroDocumentos++;
          cargos += parseFloat(get(item, 'cargo').replace(',', ''));
          abonos += parseFloat(get(item, 'abono').replace(',', ''));
        });
        info('total vencido', totalVencido, 'yessir');
        set(this, 'totalVencido', totalVencido);
        set(this, 'documentosVencidos', documentosVencidos);
        set(this, 'numeroDocumentos', numeroDocumentos);
        set(this, 'cargos', cargos);
        set(this, 'abonos', abonos);
      });
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
      set(this, 'showData', true);
    },
    cerrarModal() {

    },
    saldarRecibo() {
      let listaDocumentos =[]
      let recibo = get(this, 'recibo');
      let lista = get(this, 'recibosmovimientosLista');
      lista.forEach((item)=> {
        if (get(item, 'elegido') === true) {
          listaDocumentos.push(get(item, 'movimiento'));
        }
      });
      info('cancelando', listaDocumentos.join(','),    recibo);
      let movsLista = listaDocumentos.join(',');
      var record = this.store.createRecord('recibocancelacion', {
        recibo: recibo,
        movimientos: movsLista
      });
      record.save().then(()=> {
        info('se grabo correctamente');
      }, (error)=> {
        info('hubo un error al grabar');
      });

    },
    procesaReciboDocumento(documento) {
      let docs = get(this, "recibosmovimientosLista");
      let cual = docs.findBy("documento", documento);
      if (get(cual, 'elegido') === false) {
        set(cual, 'elegido', true);
      } else {
        set(cual, 'elegido', false);
      }
    },
    procesaRecibo(recibo, id) {
      let lista = Ember.A();
      let isArcadia = get(this, 'isArcadia');
      let company = isArcadia ? 'arcadia' : '';
      info('valor de recibo de recibo', id);
      set(this, 'recibo', recibo);
      this.store.unloadAll('recibomovimiento');
      // set(this, 'recibosmovimientosLista', this.store.query('recibomovimiento', { company, recibo }));
      this.store.query('recibomovimiento', { company, recibo }).then((data)=> {
        data.forEach((item)=> {
          if (id === get(item, 'movimiento')) {
            let { movimiento, fecha, cantidad, documento } = item.getProperties('movimiento', 'fecha', 'cantidad', 'documento');
            let elegido = true;
            lista.pushObject({ elegido, movimiento, fecha, cantidad, documento });
          } else{
            let { movimiento, fecha, cantidad, documento } = item.getProperties('movimiento', 'fecha', 'cantidad', 'documento');
            let elegido = false;
            lista.pushObject({ elegido, movimiento, fecha, cantidad, documento });
          }
        });
      });
      set(this, 'recibosmovimientosLista', lista);
    },
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
