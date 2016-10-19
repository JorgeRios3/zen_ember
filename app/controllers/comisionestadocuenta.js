import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  Logger: { info },
  inject: { service },
  setProperties,
  getProperties
} = Ember;

let documentoSelect = Ember.Object.extend({
  idDoc: '',
  pagoimporte: ''
});

export default Ember.Controller.extend(FormatterMixin, {
  comodin: service(),
  estatusLista: [{ 'id': 1, 'label': 'Todo', 'estatus': 'H' },
    { 'id': 2, 'label': 'Solicitud', 'estatus': 'S' },
    { 'id': 3, 'label': 'Revisado', 'estatus': 'R' },
    { 'id': 4, 'label': 'Autorizado', 'estatus': 'A' },
    { 'id': 5, 'label': 'Elaborado', 'estatus': 'E' },
    { 'id': 6, 'label': 'Fondeado', 'estatus': 'F' },
    { 'id': 7, 'label': 'Cobrado', 'estatus': 'B' },
    { 'id': 8, 'label': 'Retenido', 'estatus': 'T' },
    { 'id': 9, 'label': 'Cancelado', 'estatus': 'C' },
    { 'id': 10, 'label': 'Comisionable', 'estatus': 'Y' },
    { 'id': 11, 'label': 'Comisionado', 'estatus': 'Z' }],
  listaDocumentosComision: null,
  listaMovimientosComision: null,
  muestraDocumentos: true,
  etapasDocumentos: null,
  labelDocumento: '',
  session: service(),
  selectedGerente: null,
  selectedVendedor: null,
  listaDocumentosAux: null,
  totalSaldo: 0,
  totalCargo: 0,
  totalAbono: 0,
  totalSaldoEtapa: 0,
  totalCargoEtapa: 0,
  totalAbonoEtapa: 0,
  totalesEtapa: false,
  mostrarFormaPagar: false,
  aPagar: '',
  documentoAPagar: '',
  errorModal: '',
  mostrarFormaRecibo: false,
  cantidadImporte: '',
  cantidadImpuesto: '',
  tipoPago: '',
  referenciaPago: '',
  recordPago: null,
  mostrarModal: false,
  showComisiones: false,
  comisionesLista: null,
  limiteComisiones: 30,
  modalLimiteComosiones: false,
  mostrarBotonReporte: false,
  venedorEsGerente: false,
  mostrarComisionManual: false,
  inmuebleComision: '',
  inmuebleVendido: '',
  importeComisionNueva: '',
  comisionManualExito: false,
  importeComisionComputed: computed.gt('importeComisionNueva', 0),
  init() {
    this._super(...arguments);
    set(this, 'ListaDocumentosPagar', Ember.ArrayProxy.create({ content: [] }));
  },
  observaVieneDePagos: computed('vienedePagoComisiones', {
    get() {
      if(!isEmpty('vienedePagoComisiones')) {

      }
    }

  }),
  observaRecordPago: observer('recordPago.pagoimporte', function() {
    try {
      let pago = get(this, 'recordPago');
      info('esta entrando en oserba record pago vale', get(pago, 'pagoimporte'));
      if (parseFloat(get(pago, 'pagoimporte')) === 0) {
        set(this, 'mostrarBotonReporte', true);
      } else {
        set(this, 'mostrarBotonReporte', false);
      }
    } catch(err) {
      set(this, 'mostrarBotonReporte', false);
      info('saliendo por catch no hay pago importe', err.message);
    }
  }),
  obsevarEtapaFiltroSelected: observer('etapaFiltroSelected', function() {
    if (get(this, 'listaDocumentosAux') == null) {
      set(this, 'listaDocumentosAux', get(this, 'listaDocumentosComision'));
    }
    if (get(this, 'etapaFiltroSelected') === 0) {
      set(this, 'totalesEtapa', false);
      return;
    }
    if (get(this, 'etapaFiltroSelected') === 'todas') {
      set(this, 'listaDocumentosComision', get(this, 'listaDocumentosAux'));
      set(this, 'totalesEtapa', false);
      return;
    }
    let listaFiltro = Ember.A();
    set(this, 'totalesEtapa', true);
    let totalSaldoEtapa = 0;
    let totalCargoEtapa = 0;
    let totalAbonoEtapa = 0;
    let etapa = get(this, 'etapaFiltroSelected');
    let listaDocumentos = get(this, 'listaDocumentosAux');
    let lista = listaDocumentos.filter((item)=> {
      if (parseInt(etapa) === get(item, 'etapa')) {
        totalSaldoEtapa += get(item, 'saldoNumber');
        totalCargoEtapa += get(item, 'cargoNumber');
        totalAbonoEtapa += get(item, 'abonoNumber');
        return true;
      } else {
        return false;
      }
    });
    set(this, 'listaDocumentosComision', lista);
    // get(this, 'listaDocumentosComision').setEach('seleccionado', false);
    set(this, 'totalSaldoEtapa', this.formatter(totalSaldoEtapa));
    set(this, 'totalCargoEtapa', this.formatter(totalCargoEtapa));
    set(this, 'totalAbonoEtapa', this.formatter(totalAbonoEtapa));
  }),
  roundValue(value) {
    return (Math.round(value * 100) / 100).toFixed(2);
  },
  documentosVendedor(vendedor) {
    set(this, 'listaDocumentosAux', null);
    set(this, 'etapaFiltroSelected', 0);
    set(this, 'muestraDocumentos', true);
    let lista = Ember.A();
    let etapasLista = Ember.A();
    let setEtapas = new Set([]);
    let totalSaldo = 0;
    let totalCargo = 0;
    let totalAbono = 0;
    this.store.unloadAll('documentocomision');
    this.store.query('documentocomision', { vendedor })
    .then((data)=> {
      data.forEach((item)=> {
        let etapaFind = get(item, 'etapa');
        let etapaObjecto = get(this, 'listaEtapas').findBy('id', `${etapaFind}`);
        if (!setEtapas.has(etapaFind)) {
          setEtapas.add(etapaFind);
          etapasLista.pushObject(etapaObjecto);
        }
        let etapaNombre = get(etapaObjecto, 'nombre');
        let { id, inmueble, cuenta, etapa, saldo, cargo, abono, precioneto, fechareconocimiento, tieneSaldo, manzana, lote, porcentajecompartido } = getProperties(item, 'id inmueble cuenta etapa saldo cargo abono precioneto fechareconocimiento tieneSaldo manzana lote porcentajecompartido'.w());
        totalSaldo += get(item, 'saldo');
        totalCargo += get(item, 'cargo');
        totalAbono += get(item, 'abono');
        let eliminarDocumentoManual = get(item, 'saldo') === get(item, 'cargo') && precioneto === 0 ? true : false;
        lista.pushObject({
          etapaNombre,
          id,
          inmueble,
          cuenta,
          etapa,
          saldo: this.formatter(get(item, 'saldo')),
          cargo: this.formatter(get(item, 'cargo')),
          abono: this.formatter(get(item, 'abono')),
          saldoNumber: get(item, 'saldo'),
          cargoNumber: get(item, 'cargo'),
          abonoNumber: get(item, 'abono'),
          precioneto: this.formatter(precioneto),
          fechareconocimiento,
          tieneSaldo,
          manzana,
          lote,
          seleccionado: false,
          porcentajecompartido,
          eliminarDocumentoManual
        });
      });
      set(this, 'listaDocumentosComision', lista);
      set(this, 'totalSaldo', this.formatter(totalSaldo));
      set(this, 'totalCargo', this.formatter(totalCargo));
      set(this, 'totalAbono', this.formatter(totalAbono));
      etapasLista.pushObject({ id: 'todas', nombre: 'Todas' });
      set(this, 'etapasDocumentos', etapasLista);
    });
  },
  observaSelectedVendedor: observer('selectedVendedor', function() {
    if (get(this, 'selectedVendedor') !== null) {
      let vendedor = get(get(this, 'selectedVendedor'), 'id');
      set(this, 'venedorEsGerente', get(get(this, 'selectedVendedor'), 'esgerente'));
      this.store.unloadAll('documentocomision');
      this.documentosVendedor(vendedor);
    }
  }),
  nombrevendedor: observer('gtevdor', function() {
    let idVendedorCatalogo = null;
    let lista = Ember.A();
    let etapasLista = Ember.A();
    let setEtapas = new Set([]);
    let nombre = '';
    let totalSaldo = 0;
    let totalCargo = 0;
    let totalAbono = 0;
    let que = get(this, 'gtevdor');
    if (get(que, 'idvendedor') !== 0 && get(que, 'idgerente') !== 0) {
      this.store.query('vendedorcomision', { gerente: get(que, 'idgerente') })
      .then((data)=> {
        data.forEach((item)=> {
          if (get(que, 'idvendedor') === get(item, 'vendedor')) {
            info(get(item, 'id'));
            idVendedorCatalogo = get(item, 'id');
            set(this, 'selectedVendedor', idVendedorCatalogo);
          }
        });
        this.store.query('documentocomision', { vendedor: idVendedorCatalogo })
        .then((data)=> {
          data.forEach((item)=> {
            let etapaFind = get(item, 'etapa');
            let etapaObjecto = get(this, 'listaEtapas').findBy('id', `${etapaFind}`);
            if (!setEtapas.has(etapaFind)) {
              setEtapas.add(etapaFind);
              etapasLista.pushObject(etapaObjecto);
            }
            let etapaNombre = get(etapaObjecto, 'nombre');
            let { id, inmueble, cuenta, etapa, saldo, cargo, abono, precioneto, fechareconocimiento, tieneSaldo } = getProperties(item, 'id inmueble cuenta etapa saldo cargo abono precioneto fechareconocimiento tieneSaldo'.w());
            totalSaldo += get(item, 'saldo');
            totalCargo += get(item, 'cargo');
            totalAbono += get(item, 'abono');
            lista.pushObject({
              etapaNombre,
              id,
              inmueble,
              cuenta,
              etapa,
              saldo: this.formatter(get(item, 'saldo')),
              cargo: this.formatter(get(item, 'cargo')),
              abono: this.formatter(get(item, 'abono')),
              saldoNumber: get(item, 'saldo'),
              cargoNumber: get(item, 'cargo'),
              abonoNumber: get(item, 'abono'),
              precioneto,
              fechareconocimiento,
              tieneSaldo,
              seleccionado: false
            });
          });
          set(this, 'listaDocumentosComision', lista);
          set(this, 'totalSaldo', this.formatter(totalSaldo));
          set(this, 'totalCargo', this.formatter(totalCargo));
          set(this, 'totalAbono', this.formatter(totalAbono));
          etapasLista.pushObject({ id: 'todas', nombre: 'Todas' });
          set(this, 'etapasDocumentos', etapasLista);
        });
      });
    } else {
      info('no es gerente ni vendedor');
    }
  }),
  misvendedores: computed('selectedGerente', {
    get() {
      if (get(this, 'selectedGerente') !== null) {
        set(this, 'listaDocumentosComision', null);
        set(this, 'totalSaldo', this.formatter(0));
        set(this, 'totalCargo', this.formatter(0));
        set(this, 'totalAbono', this.formatter(0));
        info('paso por selectedGerente cuando entro por vendedor puesto');
        return this.store.query('vendedorcomision', { gerente: get(this, 'selectedGerente') });
      }
    }
  }),
  actions: {
    prueba() {
      info('se fue por aqui');
    },
    borrarDocumentoManual(comision) {
      let vendedor = get(get(this, 'selectedVendedor'), 'id');
      this.store.unloadAll('documentocomision');
      this.store.find('documentocomision', comision)
      .then((data)=> {
        data.deleteRecord();
        data.save().then(()=> {
          info('se borro exitoso');
          this.documentosVendedor(vendedor);
        }, (error)=> {
          info('no se borro error en save');
        });
      });
    },
    guardarComisionNueva() {
      let cuentavendedor = get(get(this, 'selectedVendedor'), 'id');
      let cargo = get(this, 'importeComisionNueva');
      let inmueble = get(get(this, 'inmuebleVendido'), 'id');
      info('vendedor', cuentavendedor);
      info('inmueble', inmueble);
      info('cargo', cargo);
      let record = this.store.createRecord('documentocomision', {
        cuentavendedor,
        cargo,
        inmueble
      });
      record.save().then((data)=> {
        info('se grabo la cimision nueva');
        set(this, 'inmuebleVendido', '');
        set(this, 'importeComisionNueva', '');
        this.notifyPropertyChange('mostrarFormarComisionManual');
        this.documentosVendedor(cuentavendedor);
        this.send('mostrarFormarComisionManual');
        set(this, 'comisionManualExito',  true);
        Ember.run.later('', ()=> {
          set(this, 'comisionManualExito', false);
        }, 5000);
      }, (error)=> {
        info('error grabarcomisionnueva');
      });
    },
    buscarInmuebleComision() {
      let inmueble = get(this, 'inmuebleComision');
      this.store.find('inmueblevendido', inmueble)
      .then((data)=> {
        set(this, 'inmuebleVendido', data);
        info('llego inmueblevendido');
      }, (error)=> {
        info('trono inmueblevendido');
      });
    },
    mostrarFormarComisionManual() {
      set(this, 'inmuebleComision', '');
      set(this, 'inmuebleVendido', '');
      set(this, 'importeComisionNueva', '');
      this.toggleProperty('mostrarComisionManual');
    },
    irASolicitudDePago(pago) {
      let que = get(this, 'gtevdor');
      let vendedor = '';
      let gerente = '';
      if (get(que, 'idvendedor') !== 0 && get(que, 'idgerente') !== 0) {
        gerente = get(this, 'selectedGerente');
        vendedor = get(this, 'selectedVendedor');
      } else {
        gerente = get(this, 'selectedGerente');
        vendedor = get(this, 'selectedVendedor');
      }
      let objetovendedorGerente = { gerente, vendedor };
      let comodin = get(this, 'comodin');
      set(comodin, 'pago', pago);
      set(comodin, 'vendedorEstadoCuentaAndPagos', objetovendedorGerente);
      this.transitionToRoute('pagoscomisiones');
    },
    togglePrinterComponent() {
      let that = this;
      Ember.run.later('', ()=> {
        that.transitionToRoute('index');
      }, 1000);
      set(this, 'mostrarBotonReporte', false);
    },
    closeComponent() {
      info('cerro el componente');
      set(this, 'mostrarBotonReporte', false);
    },
    cerrarComisiones() {
      set(this, 'showComisiones', false);
    },
    mostrarComisiones() {
      let lista = Ember.A();
      let pago = get(this, 'recordPago');
      let pagoId = get(pago, 'id');
      info('pidiendo comisiones del pago', pagoId);
      set(this, 'showComisiones', true);
      this.store.query('pagocomisiondetalle', { pago: pagoId })
      .then((data)=> {
        data.forEach((item)=> {
          let etapaFind = get(item, 'etapa');
          let etapaObjecto = get(this, 'listaEtapas').findBy('id', `${etapaFind}`);
          let etapaNombre = get(etapaObjecto, 'nombre');
          let { id, documento, inmueble, cuenta, manzana, lote, importe }  = getProperties(item, 'id documento inmueble cuenta manzana lote importe'.w());
          lista.pushObject({
            id,
            documento,
            inmueble,
            cuenta,
            etapaNombre,
            manzana,
            lote,
            importe: this.formatter(importe)
          });
        });
        info('entro');
        set(this, 'comisionesLista', lista);
      }, (error)=> {
        info('fallo');
      });
    },
    ok() {
      set(this, 'mostrarModal', false);
      set(this, 'modalLimiteComosiones', false);
      info('cerro modal');
    },
    borrarRecibo(recibo) {
      set(this, 'listaDocumentosComision', 	null);
      this.store.unloadAll('pagocomision');
      let borrar = this.store.find('pagocomision', recibo)
      .then((dato)=> {
        dato.deleteRecord();
        info(dato.get('isDeleted pagocomision')); // => true
        dato.save(); // => DEL
        set(this, 'recordPago', null);
        this.store.unloadAll('movimientocomision');
        this.notifyPropertyChange('selectedVendedor');
        let vendedor = get(this, 'selectedVendedor');
        this.documentosVendedor(vendedor);
      });
    },
    generarRecibo() {
      let pagoimporte = get(this, 'cantidadImporte');
      let pagoimpuesto = get(this, 'cantidadImpuesto');
      let pagotipo = get(this, 'tipoPago');
      let pagoreferencia = get(this, 'referenciaPago');
      info('se genero el recibo');
      this.toggleProperty('mostrarFormaRecibo');
      let record = this.store.createRecord('pagocomision', {
        pagoimporte,
        pagoimpuesto,
        pagotipo,
        pagoreferencia
      });
      record.save().then(()=> {
        info('id del record', get(record, 'id'));
        set(this, 'recordPago', record);
        set(this, 'cantidadImporte', '');
        set(this, 'cantidadImpuesto', '');
        set(this, 'tipoPago', '');
        set(this, 'referenciaPago', '');
      }, (error)=> {
        info('problema al grabar el pagocomision');
      });
    },
    mostrarForma() {
      this.toggleProperty('mostrarFormaRecibo');
    },
    pagarDocumento() {
      info('length de array ', get(this, 'ListaDocumentosPagar.length'));
      if (get(this, 'ListaDocumentosPagar.length') + 1 > get(this, 'limiteComisiones')) {
        set(this, 'modalLimiteComosiones', true);
        return;
      } else {
        let pago = get(this, 'recordPago');
        let documento = get(this, 'documentoAPagar');
        info('valor de documento', documento);
        if (parseFloat(get(this, 'aPagar')) > get(documento, 'saldoNumber')) {
          set(this, 'errorModal', 'El importe no puede ser mayor al importe de la comision a pagar');
          return;
        }
        if (parseFloat(get(this, 'aPagar')) <= 0 || isEmpty(get(this, 'aPagar'))) {
          info('valor id doc', get(documento, 'id'));
          set(this, 'errorModal', 'Debe de haber una cantidad para abonar a la comision');
          return;
        }
        if (parseFloat(get(pago, 'pagoimporte')) < parseFloat(get(this, 'aPagar'))) {
          set(this, 'errorModal', 'El importe a pagar no puede ser mayor al saldo del recibo');
          return;
        } else {
          let record = this.store.createRecord('movimientocomision', {
            pago: get(pago, 'id'),
            documento: get(documento, 'id'),
            importe: get(this, 'aPagar')
          });
          record.save().then(()=> {
            info('se guardo');
            let resto = parseFloat(get(pago, 'pagoimporte')) - parseFloat(get(this, 'aPagar'));
            set(pago, 'pagoimporte', this.roundValue(resto));
            let saldoDocumento = parseFloat(get(documento, 'saldoNumber')) - parseFloat(get(this, 'aPagar'));
            saldoDocumento = this.roundValue(saldoDocumento);
            set(get(this, 'documentoAPagar'), 'saldo', saldoDocumento <= 0 ? '0' : this.formatter(saldoDocumento));
            set(get(this, 'documentoAPagar'), 'saldoNumber', saldoDocumento);
            let abonoDocumento = parseFloat(get(documento, 'abono')) + parseFloat(get(this, 'aPagar'));
            abonoDocumento = this.roundValue(abonoDocumento);
            set(documento, 'abono', this.formatter(abonoDocumento));
            set(documento, 'abonoNumber', abonoDocumento);
            set(get(this, 'documentoAPagar'), 'seleccionado', true);
            set(this, 'mostrarFormaPagar', false);
            set(this, 'muestraDocumentos', true);
            get(this, 'ListaDocumentosPagar').pushObject(documentoSelect.create({
              id: parseInt(get(documento, 'id')),
              pagoimporte: get(this, 'aPagar'),
              movimiento: get(record, 'id')
            }));
          }, (error)=> {
            info('no se guardo el movmiento');
          });
        }
      }
    },
    CancelarFormaPagar() {
      set(this, 'muestraDocumentos', true);
      set(this, 'mostrarFormaPagar', false);
      set(this, 'errorModal', '');
    },
    agregaDocumento(documento) {
      let pago = get(this, 'recordPago');
      if (parseFloat(get(pago, 'pagoimporte')) > get(documento, 'saldoNumber')) {
        set(this, 'aPagar', parseFloat(get(documento, 'saldoNumber')));
      } else {
        set(this, 'aPagar', '');
      }
      set(this, 'documentoAPagar', documento);
      set(this, 'muestraDocumentos', false);
      set(this, 'mostrarFormaPagar', true);
    },
    quitaDocumento(documento) {
      this.store.unloadAll('movimientocomision');
      let pago = get(this, 'recordPago');
      let idDocumento = get(documento, 'id');
      info('valor a quitar', idDocumento);
      let documentoABorrar = get(this, 'ListaDocumentosPagar').findBy('id', parseInt(get(documento, 'id')));
      let idDocumentoABorrar = get(documentoABorrar, 'movimiento');
      info('movimiento a borraer', idDocumentoABorrar);
      let borrar = this.store.find('movimientocomision', idDocumentoABorrar).then((dato)=> {
        dato.deleteRecord();
        info(dato.get('isDeleted')); // => true
        dato.save(); // => DEL
        let resto = parseFloat(get(pago, 'pagoimporte')) + parseFloat(get(documentoABorrar, 'pagoimporte'));
        set(pago, 'pagoimporte', this.roundValue(resto));
        let saldoDocumento = parseFloat(get(documento, 'saldoNumber')) + parseFloat(get(documentoABorrar, 'pagoimporte'));
        saldoDocumento = this.roundValue(saldoDocumento);
        set(documento, 'saldo', saldoDocumento <= 0 ? '0' : this.formatter(saldoDocumento));
        set(documento, 'saldoNumber', saldoDocumento);
        let restaAbono = parseFloat(get(documento, 'abono')) - parseFloat(get(documentoABorrar, 'pagoimporte'));
        restaAbono = this.roundValue(restaAbono);
        set(documento, 'abonoNumber', restaAbono);
        set(documento, 'abono', restaAbono <= 0 ? '0' : this.formatter(restaAbono));
        set(documento, 'seleccionado', false);
        get(this, 'ListaDocumentosPagar').removeObject(documentoABorrar);
      }, (error)=> {
        info('error');
      });
    },
    selectedDocumento(documento) {
      set(this, 'labelDocumento', get(documento, 'id'));
      this.toggleProperty('muestraDocumentos');
      let lista = Ember.A();
      this.store.query('movimientocomision', { documento: get(documento, 'id') })
      .then((data)=> {
        data.forEach((item)=> {
          lista.pushObject(item);
        });
      });
      set(this, 'listaMovimientosComision', lista);
    },
    cerrarMovimientos() {
      set(this, 'listaMovimientosComision', null);
      this.toggleProperty('muestraDocumentos');
    }
  }
});
