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

export default Ember.Controller.extend(FormatterMixin, {
  listaDocumentosComision: null,
  listaMovimientosComision: null,
  muestraDocumentos: true,
  labelDocumento: '',
  session: service(),
  selectedGerente: null,
  selectedVendedor: null,
  totalSaldo: 0,
  totalCargo: 0,
  totalAbono: 0,
  observaSelectedVendedor: observer('selectedVendedor', function() {
    if (get(this, 'selectedVendedor') !== null) {
      let lista = Ember.A();
      let totalSaldo = 0;
      let totalCargo = 0; 
      let totalAbono = 0;
      this.store.unloadAll('documentocomision');
      this.store.query('documentocomision', {vendedor: get(this, 'selectedVendedor')})
      .then((data)=> {
        data.forEach((item)=> {
          let etapa = get(item, 'etapa');
          let etapaObjecto = get(this, 'listaEtapas').findBy('id', `${etapa}`);
           let etapaNombre = get(etapaObjecto, 'nombre');
           let { id, inmueble, cuenta, etapa2, saldo, cargo, abono, precioneto, fechareconocimiento } = getProperties(item, 'id inmueble cuenta etapa saldo cargo abono precioneto fechareconocimiento'.w());
           totalSaldo+=get(item,'saldo');
           totalCargo+=get(item, 'cargo');
           totalAbono+=get(item, 'abono');
          lista.pushObject({
          	etapaNombre,
          	id,
          	inmueble, 
          	cuenta, 
          	etapa2, 
          	saldo: this.formatter(get(item,'saldo')),
          	cargo: this.formatter(get(item, 'cargo')),
          	abono: this.formatter(get(item, 'abono')),
          	precioneto, 
          	fechareconocimiento
          });
        });
        set(this, 'listaDocumentosComision', lista);
        set(this, 'totalSaldo', this.formatter(totalSaldo));
        set(this, 'totalCargo', this.formatter(totalCargo));
        set(this, 'totalAbono', this.formatter(totalAbono));
      });
    }
  }),
  nombrevendedor: observer('gtevdor', function() {
  	  let idVendedorCatalogo = null;
  	  let lista = Ember.A();
  	  let nombre = '';
  	  let totalSaldo = 0;
      let totalCargo = 0; 
      let totalAbono = 0;
      let que = get(this, 'gtevdor');
      if (get(que, 'idvendedor') !== 0 && get(que, 'idgerente') !== 0) {
      	info('pidiendo vendedorcomision');
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
              let etapa = get(item, 'etapa');
          let etapaObjecto = get(this, 'listaEtapas').findBy('id', `${etapa}`);
           let etapaNombre = get(etapaObjecto, 'nombre');
           let { id, inmueble, cuenta, etapa2, saldo, cargo, abono, precioneto, fechareconocimiento } = getProperties(item, 'id inmueble cuenta etapa saldo cargo abono precioneto fechareconocimiento'.w());
           totalSaldo+=get(item,'saldo');
           totalCargo+=get(item, 'cargo');
           totalAbono+=get(item, 'abono');
          lista.pushObject({
          	etapaNombre,
          	id,
          	inmueble, 
          	cuenta, 
          	etapa2, 
          	saldo: this.formatter(get(item,'saldo')),
          	cargo: this.formatter(get(item, 'cargo')),
          	abono: this.formatter(get(item, 'abono')),
          	precioneto, 
          	fechareconocimiento
          });
        });
        set(this, 'listaDocumentosComision', lista);
        set(this, 'totalSaldo', this.formatter(totalSaldo));
        set(this, 'totalCargo', this.formatter(totalCargo));
        set(this, 'totalAbono', this.formatter(totalAbono));
          });
        });
      } else {
      	info('no es gerente ni vendedor');
      }
  }),
  misvendedores: computed('selectedGerente', {
    get() {
      if( get(this, 'selectedGerente') !== null){
        info('paso por selectedGerente cuando entro por vendedor puesto');
        return this.store.query('vendedorcomision', {gerente: get(this, 'selectedGerente')});
      }
    }
  }),
  actions: {
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
