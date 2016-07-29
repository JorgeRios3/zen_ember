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
  init() {
    this._super(...arguments);
    set(this, 'ListaDocumentosPagar', Ember.ArrayProxy.create({ content: [] }));
  },
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
  	  // get(this, 'listaDocumentosComision').setEach('seleccionado', false);
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
    })
    set(this, 'listaDocumentosComision', lista);
    // get(this, 'listaDocumentosComision').setEach('seleccionado', false);
    set(this, 'totalSaldoEtapa', this.formatter(totalSaldoEtapa));
    set(this, 'totalCargoEtapa', this.formatter(totalCargoEtapa));
    set(this, 'totalAbonoEtapa', this.formatter(totalAbonoEtapa));
  }),
  roundValue(value) {
    return (Math.round(value*100)/100).toFixed(2)
  },
  observaSelectedVendedor: observer('selectedVendedor', function() {
    if (get(this, 'selectedVendedor') !== null) {
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
      this.store.query('documentocomision', {vendedor: get(this, 'selectedVendedor')})
      .then((data)=> {
        data.forEach((item)=> {
          let etapaFind = get(item, 'etapa');
          let etapaObjecto = get(this, 'listaEtapas').findBy('id', `${etapaFind}`);
          if (!setEtapas.has(etapaFind)) {
            setEtapas.add(etapaFind);
            etapasLista.pushObject(etapaObjecto);
          }
           let etapaNombre = get(etapaObjecto, 'nombre');
           let { id, inmueble, cuenta, etapa, saldo, cargo, abono, precioneto, fechareconocimiento, tieneSaldo} = getProperties(item, 'id inmueble cuenta etapa saldo cargo abono precioneto fechareconocimiento tieneSaldo'.w());
           totalSaldo += get(item,'saldo');
           totalCargo += get(item, 'cargo');
           totalAbono += get(item, 'abono');
          lista.pushObject({
          	etapaNombre,
          	id,
          	inmueble,
          	cuenta,
          	etapa,
          	saldo: this.formatter(get(item,'saldo')),
          	cargo: this.formatter(get(item, 'cargo')),
          	abono: this.formatter(get(item, 'abono')),
          	saldoNumber: get(item,'saldo'),
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
        etapasLista.pushObject({ id: 'todas', nombre: 'Todas'});
        set(this, 'etapasDocumentos', etapasLista);
      });
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
            if(get(que, 'idvendedor') === get(item, 'vendedor')) {
              info(get(item, 'id'));
              idVendedorCatalogo = get(item, 'id');
            }
          });
          this.store.query('documentocomision', { vendedor: idVendedorCatalogo})
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
           totalSaldo += get(item,'saldo');
           totalCargo += get(item, 'cargo');
           totalAbono += get(item, 'abono');
          lista.pushObject({
          	etapaNombre,
          	id,
          	inmueble,
          	cuenta,
          	etapa,
          	saldo: this.formatter(get(item,'saldo')),
          	cargo: this.formatter(get(item, 'cargo')),
          	abono: this.formatter(get(item, 'abono')),
          	saldoNumber: get(item,'saldo'),
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
        etapasLista.pushObject({ id: 'todas', nombre: 'Todas'});
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
        info('paso por selectedGerente cuando entro por vendedor puesto');
        return this.store.query('vendedorcomision', {gerente: get(this, 'selectedGerente')});
      }
    }
  }),
  actions: {
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
  	  },(error)=> {
  	    info('problema al grabar el pagocomision');
  	  });
  	},
  	mostrarForma() {
  	  this.toggleProperty('mostrarFormaRecibo');
  	},
  	ok() {
  	  let pago = get(this, 'recordPago');
  	  let documento = get(this, 'documentoAPagar')
  	  info('valor de documento', documento);
  	  if (parseFloat(get(this, 'aPagar')) > get(documento, 'saldoNumber')) {
  	  	set(this, 'errorModal', 'El importe no puede ser mayor al importe de la comision a pagar');
  	  	return;
  	  }
  	  if(parseFloat(get(this, 'aPagar')) <= 0 || isEmpty(get(this, 'aPagar'))) {
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
  	  	  let restoDocumento = parseFloat(get('documentoAPagar', 'saldo')) - parseFloat(get(this, 'aPagar'))
  	  	  set(pago, 'pagoimporte', this.roundValue(resto));
  	  	  set(get(this, 'documentoAPagar'), 'seleccionado', true);
  	  	  set(get(this, 'documentoAPagar'), 'saldo', resto <= 0 ? '0' : this.formatter(restoDocumento));
  	  	  // aqui es contra el saldo del propio documento - a pagar
  	  	  set(get(this, 'documentoAPagar'), 'saldoNumber', this.roundValue(restoDocumento));
  	  	  //creo que este esta de mas set(get(this, 'documentoAPagar'), 'saldo', this.roundValue(restoDocumento));
  	  	  set(this, 'mostrarFormaPagar', false);
  	  	  set(this, 'muestraDocumentos', true);
  	  	  get(this, 'ListaDocumentosPagar').pushObject(documentoSelect.create({
  	  	    id: parseInt(get(documento, 'id')),
  	  	    pagoimporte: get(this, 'aPagar'),
  	  	    movimiento: get(record, 'id')
  	  	   }));

  	  	},(error)=> {
  	  	  info('no se guardo el movmiento');
  	  	})
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
  	  info('movimiento a borraer',idDocumentoABorrar);
  	  let borrar = this.store.find('movimientocomision', idDocumentoABorrar).then((dato)=> {
  	  	 dato.deleteRecord();
         info(dato.get('isDeleted')); // => true
         dato.save(); // => DEL
  	  },(error)=> {
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
